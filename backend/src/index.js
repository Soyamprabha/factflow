import express from "express";
import cors from "cors";
import { config } from "dotenv";
import multer from "multer";
import { factcheckAPI, getImageData, getInformation, getLinkData, processInformation, searchAPI } from "./utils.js"

config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image file provided" });
        }
        const base64Image = req.file.buffer.toString("base64");

        const responseData = await getImageData(base64Image);
        console.log(responseData)
        const searchResults = await searchAPI(responseData.keywords)
        const factResults = await factcheckAPI(responseData.search_string)
        const data = await getInformation(responseData, searchResults, factResults)
        const verdict = await processInformation(data)
        console.log(verdict)
        res.json(verdict);
    } catch (error) {
        console.error("Error in /image route:", error);
        res.status(500).json({ error: "Error processing image" });
    }
});

app.post("/link", async (req, res) => {
    try {
        const { link } = req.body;
        if (!link) {
            return res.status(400).json({ error: "No link provided" });
        }
        const responseData = await getLinkData(link);
        console.log(responseData)
        const searchResults = await searchAPI(responseData.keywords)
        const factResults = await factcheckAPI(responseData.search_string)
        const data = await getInformation(responseData, searchResults, factResults)
        const verdict = await processInformation(data)
        console.log(verdict)
        res.json(verdict);
    } catch (error) {
        console.error("Error in /link route:", error);
        res.status(500).json({ error: "Error processing link" });
    }
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
