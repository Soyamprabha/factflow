import axios from 'axios';
import Parser from '@postlight/parser';
import { JSDOM, VirtualConsole } from "jsdom";
import { Readability } from "@mozilla/readability";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { config } from "dotenv";

config();

async function visonAPI(msg, img) {
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
        format: {
            type: "object",
            properties: {
                text: { type: "string" },
                image_contents: {
                    type: "array",
                    items: { type: "string" }
                },
                keywords: {
                    type: "array",
                    items: { type: "string" }
                }
            },
            required: ["image_contents", "text", "keywords"]
        }
    };

    const response = await axios.post('http://localhost:11434/api/chat', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // console.log(response.data)
    return response.data
}
export async function fetchContentFromURL(url) {
    try {
        const response = await axios.get(url);
        const content = response.data;
        const virtualConsole = new VirtualConsole();
        const doc = new JSDOM(content, { virtualConsole });

        const reader = new Readability(doc.window.document);
        const article = reader.parse();
        const contentMarkdown = NodeHtmlMarkdown.translate(article.content);
        let regex = /\[([^\]]+)]\(([^)]+)\)/g;
        const markdown = contentMarkdown.replace(regex, "$1");
        // console.log(markdown)
        return markdown;
    } catch (error) {
        throw new Error(`Failed to fetch content from URL: ${error}`);
    }
}

async function summarizerAPI(title, msg) {
    const data = {
        model: "deepseek-r1:8b",
        messages: [
            {
                'role': 'user',
                'content': `Can you help create a summary under 500 characters of the following webpage having thte tile ${title}? get a detailed set of 5-6 keywords to search for the topic on google. Keywords are always mandatory. Return in JSON format`,
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
        format: {
            type: "object",
            properties: {
                text: { type: "string" },
                keywords: {
                    type: "array",
                    items: { type: "string" }
                }
            },
            required: ["text", "keywords"]
        }
    };

    const response = await axios.post('http://localhost:11434/api/chat', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // console.log(response.data)
    return response.data
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
        return
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
    const msg = "Analyze this image and describe what you see, detect the text accurately and whatever you see. Text should be detailed. If there is no text in the image, describe the image. Now from the detected text and context from the image, get a detailed set of 5-6 keywords to search for the exact topic on google. Keywords are always mandatory.Return them all in JSON format.";
    const res = await visonAPI(msg, img)
    return JSON.parse(res.message.content)
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
    return JSON.parse(result.message.content);
}


export function getInformation(news, search) {
    const res = {
        news: news,
        search: search
    }
    return res;
}

export async function processInformation(news) {

    const data = {
        model: "deepseek-r1:8b",
        messages: [
            {
                role: "user",
                content: `The following data is to be used to answer the following- ${JSON.stringify(news)}`,
            },
            {
                'role': 'user',
                'content': `Please help me determine if the news is fake or real. The news is given as "news", the array "search" is given as a list of evidence from google search results. Now, if it is fake, give response as false and array evidence pointing against it, and if true, give response true, with evidence pointing towards it in order of titles and links. Return in JSON format`,
            },
        ],
        stream: false,
        format: {
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
        },
    }


    const response = await axios.post('http://localhost:11434/api/chat', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(response.data)
    return JSON.parse(response.data.message.content)
};