import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, Terminal, LogOut, Home } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import CyberTutor from '../ui/CyberTutor';
import { cn } from '../../lib/utils';

const Layout = ({ children }) => {
    const { agentName, currentMission, exitMission } = useGame();

    return (
        <div className="min-h-screen bg-slate-950 text-emerald-400 font-mono relative overflow-hidden selection:bg-emerald-500/30">
            {/* Background Grid & Scanlines handled in global css */}
            <div className="scanline"></div>

            <div className="flex h-screen max-w-[1600px] mx-auto p-4 gap-4">

                {/* LEFT SIDEBAR: MISSION CONTROL */}
                <aside className="w-64 hidden lg:flex flex-col gap-4">
                    {/* ID CARD */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-slate-900/80 border border-slate-800 p-4 rounded-lg backdrop-blur-sm relative group"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-50"><Shield className="w-12 h-12 text-slate-800" /></div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Operative</div>
                        <div className="text-xl font-bold text-white tracking-wider truncate mb-2">{agentName || 'UNKNOWN'}</div>
                        <div className="flex items-center gap-2 text-xs text-emerald-500">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            SECURE CONNECTION
                        </div>
                    </motion.div>

                    {/* AI COMPONENT */}
                    <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden flex flex-col relative">
                        <div className="p-2 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Terminal size={14} /> CYBER_AI_V1</span>
                        </div>
                        <CyberTutor />
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 flex flex-col min-w-0 relative">
                    <header className="h-14 mb-4 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/50 rounded-lg">
                        <div className="flex items-center gap-4">
                            {/* Global Abort Button */}
                            {currentMission && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        exitMission();
                                    }}
                                    className="flex items-center gap-2 text-xs font-bold text-red-500 border border-red-500/50 px-3 py-1 rounded hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                                    title="Return to Base Menu"
                                >
                                    <Home size={14} /> Base Menu
                                </button>
                            )}

                            <div className="text-xl font-bold tracking-widest bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                                CIPHER_AGENT // ACADEMY
                            </div>
                        </div>

                        <div className="flex gap-4 text-slate-400">
                            <div className="flex items-center gap-2 text-xs">
                                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                                ENCRYPTED: TSL_1.3
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 relative bg-slate-900/30 border border-slate-800 rounded-lg overflow-auto no-scrollbar backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)_inset]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
