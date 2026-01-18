import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Unlock, CheckCircle } from 'lucide-react';

const RailFence = () => {
    const { completeMission } = useGame();
    const [solved, setSolved] = useState(false);

    const handleSolve = () => {
        setSolved(true);
        setTimeout(() => {
            completeMission('rail-fence');
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold mb-8 text-white uppercase tracking-widest border-b border-neon-blue pb-2">
                Mission: The Payload
            </h1>

            {solved ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white">PAYLOAD DECODED</h2>
                    <p className="text-slate-400 mt-2">Mission Complete. Returning to base...</p>
                </motion.div>
            ) : (
                <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 p-8 rounded-lg shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-xs text-slate-500 font-mono">ENCRYPTED MESSAGE</div>
                        <Unlock className="w-5 h-5 text-slate-600" />
                    </div>

                    <div className="font-mono text-2xl text-center tracking-widest text-slate-400 mb-8 break-all">
                        H_L_O_O_L_E_W_R_D
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleSolve}
                            className="bg-neon-blue/80 text-black px-6 py-2 rounded font-bold hover:bg-neon-blue transition-colors"
                        >
                            DEBUG: Solve Cipher
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RailFence;
