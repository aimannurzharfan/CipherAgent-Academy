import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, AlertTriangle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { generateGeminiResponse } from '../../lib/gemini';

// Fallback responses for demo mode
const DEMO_RESPONSES = [
    "I'm detecting a weak encryption pattern. Try mixing the primary colors first.",
    "The hacker is monitoring the frequency. Keep your signal steady.",
    "That looks safe, but double-check your public keys.",
    "Affirmative, Agent. The line is secure... for now.",
    "Remember: Public keys can be seen by anyone. Private keys stay with you."
];

const CyberTutor = () => {
    const { currentMission, progress } = useGame();
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: "Systems online. Monitoring your mission progress, Agent." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    // Check for API Key (Simulation Mode Check)
    const hasKey = !!import.meta.env.VITE_GEMINI_API_KEY;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            let responseText = "";

            if (hasKey) {
                responseText = await generateGeminiResponse(input, currentMission);
            } else {
                // Simulation Mode
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000)); // Fake network delay
                responseText = DEMO_RESPONSES[Math.floor(Math.random() * DEMO_RESPONSES.length)];
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: responseText }]);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "ERR: CONNECTION LOST. " + error.message }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950/50">
            {!hasKey && (
                <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-2 text-[10px] text-yellow-500 flex items-center gap-2 justify-center">
                    <AlertTriangle size={12} />
                    SIMULATION MODE (NO API KEY)
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[85%] rounded-lg p-3 text-xs leading-relaxed
                            ${msg.sender === 'user'
                                ? 'bg-emerald-900/30 text-emerald-100 border border-emerald-800'
                                : 'bg-slate-800/50 text-slate-300 border border-slate-700'
                            }
                        `}>
                            {msg.sender === 'ai' && <Bot size={14} className="mb-1 text-emerald-500" />}
                            {msg.text}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800/50 p-2 rounded-lg flex gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Query CyberTutor..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                    onClick={handleSend}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded transition-colors"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default CyberTutor;
