import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, X, FolderOpen } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const BriefingModal = ({ mission, onClose, onStart }) => {
    if (!mission) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-2xl bg-slate-900 border-2 border-slate-700 shadow-2xl relative overflow-hidden"
                >
                    {/* Top Secret Stamp */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-slate-800 rotate-45 transform origin-bottom-left border border-slate-700"></div>
                    <div className="absolute top-4 right-4 text-xs text-slate-500 font-mono text-right z-10">
                        CLASSIFIED<br />CLEARANCE: LVL {mission.id === 'diffie-hellman' ? '1' : mission.id === 'mitm' ? '2' : '3'}
                    </div>

                    <div className="p-8 relative z-0">
                        <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-4">
                            <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center text-emerald-500 border border-slate-700">
                                <FolderOpen size={32} />
                            </div>
                            <div>
                                <h3 className="text-sm text-emerald-500 uppercase tracking-widest font-bold">New Assignment</h3>
                                <h1 className="text-3xl text-white font-bold font-mono">{mission.title}</h1>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <h4 className="text-slate-500 text-xs uppercase tracking-wider mb-2">Objective:</h4>
                                <p className="text-lg text-slate-300 leading-relaxed font-light border-l-2 border-emerald-500 pl-4">
                                    {mission.description}
                                </p>
                            </div>

                            <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                                <h4 className="text-neon-blue text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <ScrollText size={12} /> Intel:
                                </h4>
                                <p className="text-sm text-slate-400 font-mono">
                                    Enemy surveillance is active. You must establish a secure channel before transferring any sensitive data. Protocol dictates checking for Man-in-the-Middle attacks frequently.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-3 text-slate-400 hover:text-white transition-colors text-sm uppercase tracking-widest"
                            >
                                Decline
                            </button>
                            <button
                                onClick={onStart}
                                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all"
                            >
                                Accept Mission
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BriefingModal;
