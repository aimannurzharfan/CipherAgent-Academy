import { CRYPTO_KNOWLEDGE } from '../data/cryptoKnowledge';
import { generateGeminiResponse } from './gemini';

const DETECT_TOPIC = (message, mission) => {
    // 1. Check Mission Context
    if (mission?.path) {
        if (mission.path.includes('rail-fence')) return 'rail-fence';
        if (mission.path.includes('diffie-hellman')) return 'diffie-hellman';
        if (mission.path.includes('mitm')) return 'mitm';
    }

    // 2. Keyword Scan
    const lowerMsg = message.toLowerCase();
    for (const [key, data] of Object.entries(CRYPTO_KNOWLEDGE)) {
        if (data.keywords.some(k => lowerMsg.includes(k))) {
            return key;
        }
    }

    return 'general';
};

export const getBotResponse = async (userMessage, currentMission) => {
    const topicKey = DETECT_TOPIC(userMessage, currentMission);
    const knowledge = CRYPTO_KNOWLEDGE[topicKey] || CRYPTO_KNOWLEDGE['general'];

    // Default context to send to AI or fallback to
    const baseContext = `
        Topic: ${knowledge.title}
        Explanation: ${knowledge.simpleExplanation}
        Hint: ${knowledge.hint}
    `;

    try {
        // Attempt AI Enhancement
        const aiResponse = await generateGeminiResponse(userMessage, {
            ...currentMission,
            technicalContext: baseContext
        });

        return {
            text: aiResponse,
            isAi: true,
            topic: topicKey
        };

    } catch (error) {
        console.warn("Chatbot AI Fallback:", error.message);

        // Pure First Order Logic Fallback
        // Return strict data from Knowledge Base
        return {
            text: `${knowledge.simpleExplanation}\n\nHint: ${knowledge.hint}`,
            isAi: false,
            topic: topicKey
        };
    }
};
