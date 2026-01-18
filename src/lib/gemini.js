import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
}

export const generateGeminiResponse = async (prompt, missionContext) => {
    if (!model) {
        throw new Error("AI Offline: API Key Missing");
    }

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
        console.error("Gemini Error:", error);
        throw new Error("Secure Line Compromised (API Error)");
    }
};
