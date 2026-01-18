import { GoogleGenerativeAI } from "@google/generative-ai";

// Retrieve API Key from Environment Variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Strict validation
if (!apiKey) {
    console.warn("Warning: VITE_GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateGeminiResponse = async (prompt, missionContext) => {
    try {
        const gameContext = `
            You are "CyberTutor", a witty and slightly dramatic Spy Handler AI for a teenage spy game.
            The user is an Agent learning cryptography.
            
            CURRENT MISSION STATUS:
            ID: ${missionContext?.id || 'N/A'}
            Title: ${missionContext?.title || 'Training Mode'}
            Description: ${missionContext?.description || 'N/A'}

            Your Goal:
            1. Answer the user's question safely.
            2. Keep the "Spy" persona alive. Use terms like "Agent", "Cipher", "Signal", "Intercept".
            3. Be helpful but don't solve the puzzle immediately. Give hints.
            4. Keep responses brief (under 50 words) to fit the chat UI.
        `;

        const finalPrompt = `${gameContext}\n\nAgent Query: ${prompt}`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error(">>> DEBUG ERROR:", error);
        throw new Error(`[DebugMode] API Error: ${error.message || error.toString()}`);
    }
};
