import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API Key found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    console.log("Checking available models for API Key...");
    try {
        // There is no direct listModels on the main client in some SDK versions, 
        // but let's try a direct generation on a known model to see the specific error structure
        // actually, we can try to fetch the model info if possible, or just brute force check

        const modelsToCheck = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro", "gemini-1.5-pro"];

        for (const modelName of modelsToCheck) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ SUCCESS: ${modelName} is working.`);
                return; // Found one!
            } catch (error) {
                console.error(`❌ FAILED ${modelName}: ${error.message.split('\n')[0]}`);
            }
        }
        console.log("\nAll common models failed. This usually means the 'Generative Language API' is not enabled in the Google Cloud Console.");
    } catch (error) {
        console.error("Critical Error", error);
    }
}

listModels();
