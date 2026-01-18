import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Beaker, CheckCircle } from 'lucide-react';

const DiffieHellman = () => {
    const { completeMission } = useGame();
    const [step, setStep] = useState(0); // 0: Select Private, 1: Mix Public, 2: Send, 3: Mix Secret
    const [status, setStatus] = useState('active'); // active, success

    const handleComplete = () => {
        setStatus('success');
        setTimeout(() => {
            completeMission('diffie-hellman');
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 relative">
            <h1 className="text-2xl font-bold mb-8 text-white uppercase tracking-widest border-b border-emerald-500 pb-2">
                Mission: Secure Handshake
            </h1>

            {status === 'success' ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white">KEY ESTABLISHED</h2>
                    <p className="text-slate-400 mt-2">Secure channel generated. Returning to base...</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 gap-12 w-full max-w-4xl">
                    {/* User Station */}
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-emerald-900/50 px-3 py-1 text-xs text-emerald-400 font-bold uppercase">
                            Agent Terminal
                        </div>
                        <div className="mt-8 flex flex-col items-center gap-4">
                            <Beaker className="w-16 h-16 text-yellow-500" />
                            <p className="text-slate-400 text-sm text-center">Your private color: <span className="text-yellow-500 font-bold">Yellow</span></p>
                        </div>
                    </div>

                    {/* Network/Public Area */}
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-full h-1 bg-slate-700 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-4 text-xs text-slate-500">
                                PUBLIC NETWORK
                            </div>
                        </div>
                        <button
                            onClick={handleComplete}
                            className="bg-emerald-600 px-6 py-2 rounded text-white font-bold hover:bg-emerald-500 transition-colors"
                        >
                            DEBUG: Force Success
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiffieHellman;
