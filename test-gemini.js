import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("No GEMINI_API_KEY found in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function smokeTest() {
  console.log("Sending test prompt to gemini-1.5-flash...");
  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: "Reply with exactly: UPLINK CONFIRMED" }] }],
    });
    console.log("Response:", result.text);
    console.log("✅ Gemini API is working.");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

smokeTest();
