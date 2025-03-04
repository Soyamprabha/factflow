import axios from 'axios';
import Parser from '@postlight/parser';
import { JSDOM, VirtualConsole } from "jsdom";
import { Readability } from "@mozilla/readability";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { config } from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
function getGenerativePart(img, mimeType) {
    return {
        inlineData: {
            data: img,
            mimeType
        },
    };
}
const verifyGeminiApiKey = apiKey => {
    const API_VERSION = "v2";
    const apiUrl = `https://generativelanguage.googleapis.com/${API_VERSION}/models?key=${apiKey}`;
    const response = axios.fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        muteHttpExceptions: true,
    });
    const { error } = JSON.parse(response.getContentText());
    if (error) {
        throw new Error(error.message);
    }
    return true;
};

async function visonAPI(msg, img) {
    const schema = {
        type: "object",
        properties: {
            text: { type: "string" },
            image_contents: {
                type: "array",
                items: { type: "string" }
            },
            search_string: {
                type: "string",
            },
            keywords: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["image_contents", "text", "search_string", "keywords"]
    }
    if (verifyGeminiApiKey) {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        const img_parts = [getGenerativePart(img, "image/jpeg")];
        "image/jpeg"
        const result = await model.generateContent([msg, ...img_parts]);
        console.log(result.response.text());
        return result.response.text()
    }
    const data = {
        model: "llama3.2-vision:latest",
        messages: [
            {
                'role': 'user',
                'content': msg,
                'images': [img],
            },
        ],
        stream: false,
        format: schema
    };

    const response = await axios.post(process.env.OLLAMA_BASE_URL, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // console.log(response.data)
    return response.data.message.content
}
export async function fetchContentFromURL(url) {
    try {
        const response = await axios.get(url);
        const content = response.data;
        const virtualConsole = new VirtualConsole();
        const doc = new JSDOM(content, { virtualConsole });

        const reader = new Readability(doc.window.document);
        const article = reader.parse();
        const contentMarkdown = NodeHtmlMarkdown.translate(article.content?article.content:"");
        let regex = /\[([^\]]+)]\(([^)]+)\)/g;
        const markdown = contentMarkdown.replace(regex, "$1");
        // console.log(markdown)
        return markdown;
    } catch (error) {
        throw new Error(`Failed to fetch content from URL: ${error}`);
    }
}

async function summarizerAPI(title, msg) {
    const schema = {
        type: "object",
        properties: {
            text: { type: "string" },
            search_string: { type: "string" },
            keywords: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["text", "search_string", "keywords"]
    }
    if (verifyGeminiApiKey) {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        "image/jpeg"
        const result = await model.generateContent({
            contents: [
                {
                    'role': 'user',
                    parts: [{
                        'text': `Can you help create a summary under 800 characters of the following webpage having the title ${title}? get a detailed search string to search for the exact information and validate its credibility the search string should be in a format that makes sense and is usable by fact-check tools. Get a detailed set of 5-6 keywords to search for the topic on google. Keywords and Search string are always mandatory. Return in JSON format`,
                    }]
                },
                {
                    role: 'user',
                    parts: [{
                        'text': "The article is formatted as markdown.",
                    }]
                },
                {
                    'role': 'user',
                    parts: [{
                        'text': msg,
                    }]
                },
            ]
        });
        console.log(result.response.text());
        return result.response.text()
    }
    const data = {
        model: "deepseek-r1:8b",
        messages: [
            {
                'role': 'user',
                'content': `Can you help create a summary under 500 characters of the following webpage having the title ${title}? get a detailed search string to search for the exact information and validate its credibility the search string should be in a format that makes sense and is usable by fact-check tools. Get a detailed set of 5-6 keywords to search for the exact topic on google. Keywords and Search string are always mandatory. Return in JSON format`,
            },
            {
                role: "user",
                content: "The article is formatted as markdown.",
            },
            {
                'role': 'user',
                'content': msg,
            },
        ],
        stream: false,
        format: schema
    };

    const response = await axios.post(process.env.OLLAMA_BASE_URL, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // console.log(response.data)
    return response.data.message.content
}

export async function factcheckAPI(search_string) {
    const api_key = process.env.GOOGLE_CLOUD_API_KEY;
    const url = process.env.FACTCHECK_URL;
    const params = {
        query: search_string,
        languageCode: "en-US",
        key: api_key,
    };
    const response = await axios.get(url, { params: params })
    if (response.status === 200) {
        console.log(response.data);
    } else {
        console.log('Request failed with status code: ' + response.status);
        return []
    }
    const res = response.data;
    if (res.claims && res.claims.length > 0) {
        return res.claims.map(claim => {
            const claim_text = claim.text;
            return claim.claimReview?.map(review => ({
                claim: claim_text,
                fact_checker: review.publisher.name,
                verdict: review.textualRating,
                url: review.url,
            })) || [];
        }).flat();
    }
    return [{
        claim: search_string,
        fact_checker: "N/A",
        verdict: "N/A",
        url: "N/A",
    }];
}

export async function searchAPI(keywords) {
    const api_key = process.env.SEARCH_API_KEY;
    const url = process.env.SEARCH_URL;
    const params = {
        api_key: api_key,
        query: keywords.toString(),
        results: 5,
        country: 'in',
        page: 0,
    };
    const response = await axios.get(url, { params: params })
    if (response.status === 200) {
        console.log(response.data);
    } else {
        console.log('Request failed with status code: ' + response.status);
        return []
    }
    const res = response.data.news_results;
    let results = []
    for (let i = 0; i < res.length; i++) {
        const summary = await fetchContentFromURL(res[i].url)
        const temp = { title: res[i].title, url: res[i].url, summary: summarizerAPI(res[i].title, summary) }
        results.push(temp)
    }
    return results
}

export async function getImageData(img) {
    const msg = "Analyze this image and describe what you see, detect the text accurately and whatever you see. Text should be detailed. If there is no text in the image, describe the image. Now from the detected text and context from the image, get a detailed search string to search for the exact information and validate its credibility. The search string is always mandatory.Return them all in JSON format.";
    const res = await visonAPI(msg, img)
    return JSON.parse(res)
}

export async function getLinkData(link) {
    let result;
    try {
        const par = await Parser.parse(link, { contentType: "markdown" })
        const data = await fetchContentFromURL(link)
        result = await summarizerAPI(par.title, data)
    } catch (error) {
        console.error("Error in getLinkData:", error);
        throw error;
    }
    return JSON.parse(result);
}


export function getInformation(news, search, claims) {
    const res = {
        news: news,
        search: search,
        claims: claims
    }
    return res;
}

export async function processInformation(news) {
    const schema = {
        type: "object",
        properties: {
            response: { type: "boolean" },
            evidence_titles: {
                type: "array",
                items: {
                    type: "string",
                }
            },
            evidence_links: {
                type: "array",
                items: {
                    type: "string",
                }
            }
        },
        required: ["response", "evidence_titles", "evidence_links"]
    }
    if (verifyGeminiApiKey) {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        "image/jpeg"
        const result = await model.generateContent({
            contents: [
                {
                    'role': 'user',
                    parts: [{
                        'text': `The following data is to be used to answer the following- ${JSON.stringify(news)}`,
                    }]
                },
                {
                    'role': 'user',
                    parts: [{
                        'text': `Please help me determine if the news is fake or real. The news is given as "news", the array "search" is given as a list of evidence from google search results, the array "claims" is given as a list of evidence from claims from various more trusted sources. Act as a professional fact checker and use your own discretion searching from the search and claims arrays for results. Now, if it is fake, give response as false and array evidence pointing against it, and if true, give response true, with evidence pointing towards it in order of titles and links. Try to have multiple evidences if possible.  Return in JSON format`,
                    }]
                },
            ]
        });
        console.log(result.response.text());
        return JSON.parse(result.response.text())
    }
    const data = {
        model: "deepseek-r1:8b",
        messages: [
            {
                role: "user",
                content: `The following data is to be used to answer the following- ${JSON.stringify(news)}`,
            },
            {
                'role': 'user',
                'content': `Please help me determine if the news is fake or real. The news is given as "news", the array "search" is given as a list of evidence from google search results, the array "claims" is given as a list of evidence from claims from various more trusted sources. Act as a professional fact checker and use your own discretion searching from the search and claims arrays for results. Now, if it is fake, give response as false and array evidence pointing against it, and if true, give response true, with evidence pointing towards it in order of titles and links. Try to have multiple evidences if possible. Return in JSON format`,
            },
        ],
        stream: false,
        format: schema,
    }


    const response = await axios.post(process.env.OLLAMA_BASE_URL, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(response.data)
    return JSON.parse(response.data.message.content)
};