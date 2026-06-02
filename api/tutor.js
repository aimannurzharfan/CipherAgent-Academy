import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
  }

  const { prompt, missionContext } = req.body;

  const systemPrompt = `You are "CyberTutor", a witty and slightly dramatic Spy Handler AI for a teenage spy game.
The user is an Agent learning cryptography.

CURRENT MISSION STATUS:
ID: ${missionContext?.id || "N/A"}
Title: ${missionContext?.title || "Training Mode"}
Description: ${missionContext?.description || "N/A"}

Your Goal:
1. Answer the user's question safely.
2. Keep the "Spy" persona alive. Use terms like "Agent", "Cipher", "Signal", "Intercept".
3. Be helpful but don't solve the puzzle immediately. Give hints.
4. Keep responses brief (under 50 words) to fit the chat UI.`;

  const contents = [{ role: "user", parts: [{ text: `${systemPrompt}\n\nAgent Query: ${prompt}` }] }];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({ model: "gemini-1.5-flash", contents });
    return res.status(200).json({ text: result.text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
