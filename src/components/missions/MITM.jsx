import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ShieldAlert, CheckCircle } from 'lucide-react';

const MITM = () => {
    const { completeMission } = useGame();
    const [detected, setDetected] = useState(false);

    const handleIntercept = () => {
        setDetected(true);
        setTimeout(() => {
            completeMission('mitm');
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold mb-8 text-white uppercase tracking-widest border-b border-red-500 pb-2">
                Mission: Threat Detection
            </h1>

            {detected ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white">THREAT NEUTRALIZED</h2>
                    <p className="text-slate-400 mt-2">Hacker isolated. Returning to base...</p>
                </motion.div>
            ) : (
                <div className="text-center">
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="mb-8"
                    >
                        <ShieldAlert className="w-24 h-24 text-red-500 mx-auto" />
                    </motion.div>

                    <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto">
                        An unauthorized signal is piggybacking on the connection. Wait for the glitch and intercept it.
                    </p>

                    <button
                        onClick={handleIntercept}
                        className="bg-red-600 px-8 py-3 rounded text-white font-bold hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    >
                        INTERCEPT SIGNAL
                    </button>
                </div>
            )}
        </div>
    );
};

export default MITM;
