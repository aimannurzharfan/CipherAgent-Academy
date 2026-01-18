import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, AlertTriangle, Wifi } from 'lucide-react';
import { useCyberTutor } from '../../hooks/useCyberTutor';

const CyberTutor = () => {
    // Logic extracted to custom hook
    const { messages, options, handleOptionClick } = useCyberTutor();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-slate-950/50">
            {/* Status Header - Simplified */}
            <div className="p-2 text-[10px] flex items-center justify-between border-b bg-emerald-900/10 border-emerald-500/10 text-emerald-500">
                <div className="flex items-center gap-2">
                    <Bot size={12} />
                    <span className="font-mono tracking-wider uppercase">
                        Cyber Advisor
                    </span>
                </div>
                <div className="flex items-center gap-1.5" title="Secure Contextual Link">
                    <span className="uppercase">UPLINK ACTIVE</span>
                    <Wifi size={12} />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[90%] rounded-lg p-3 text-xs leading-relaxed border shadow-lg
                            ${msg.sender === 'user'
                                ? 'bg-emerald-500/10 text-emerald-100 border-emerald-500/20 font-mono text-[10px] tracking-wide'
                                : 'bg-slate-800/90 text-slate-200 border-slate-700'
                            }
                        `}>
                            {msg.sender === 'ai' && (
                                <div className="text-[9px] uppercase tracking-widest text-emerald-500/70 mb-1 flex items-center gap-1">
                                    <Bot size={10} /> ADVISOR
                                </div>
                            )}
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tactical Options Area */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 backdrop-blur-sm">
                <div className="flex flex-wrap gap-2 justify-center">
                    {options.length > 0 ? options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt.action)}
                            className="bg-emerald-900/40 hover:bg-emerald-600/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-100 text-[10px] tracking-wide uppercase px-3 py-2 rounded transition-all active:scale-95"
                        >
                            {`> ${opt.label}`}
                        </button>
                    )) : (
                        <span className="text-[10px] text-slate-600 italic">SYSTEM IDLE // Awaiting Status Change</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CyberTutor;
