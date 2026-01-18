import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Beaker, CheckCircle, ArrowRight, Lock, Network, Home, Play } from 'lucide-react';

const STEPS = [
    { title: "Briefing", desc: "Understand the Mission" },
    { title: "Select Secret", desc: "Choose your Private Color" },
    { title: "Mix Colors", desc: "Combine with Public Color" },
    { title: "Exchange", desc: "Send Public Mix to HQ" },
    { title: "Finalize", desc: "Create Shared Key" }
];

const COLORS = {
    public: '#EAB308', // Yellow
    hq_secret: '#22c55e', // Green
    hq_mix: '#84cc16', // Lime (Green + Yellow approx)
    user_choices: [
        { name: 'Red', hex: '#ef4444', mix_hex: '#f97316' }, // Red + Yellow = Orange
        { name: 'Blue', hex: '#3b82f6', mix_hex: '#22c55e' }, // Blue + Yellow = Greenish
        { name: 'Purple', hex: '#a855f7', mix_hex: '#d946ef' } // Purple + Yellow = Pinkish
    ]
};

const DiffieHellman = () => {
    const { completeMission, triggerEvent, exitMission, startMission } = useGame();
    const [step, setStep] = useState(0);
    const [userSecret, setUserSecret] = useState(null); // { name, hex, mix_hex }

    const nextStep = () => {
        const next = step + 1;
        setStep(next);

        // Scripted Event Trigger
        if (next === 3) { // Exchange Step
            triggerEvent('dh_exchange_step', { secretColor: userSecret?.name || 'Secret' });
        }

        if (next === 5) {
            setTimeout(() => completeMission('diffie-hellman'), 2000);
        }
    };

    const selectSecret = (color) => {
        setUserSecret(color);
        nextStep();
    };

    return (
        <div className="h-full flex flex-col items-center p-8 relative">
            {/* Header / Progress */}
            <div className="w-full max-w-4xl mb-8">
                <h1 className="text-xl font-bold text-white uppercase tracking-widest border-b border-yellow-500 pb-2 mb-4">
                    Mission: Secure Handshake
                </h1>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        className="h-full bg-yellow-500"
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl relative">
                <AnimatePresence mode="wait">

                    {/* STEP 0: BRIEFING */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="bg-slate-900 border border-slate-700 p-8 rounded-xl max-w-lg text-center"
                        >
                            <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-4">The Objective</h2>
                            <p className="text-stone-300 mb-8 leading-relaxed">
                                You need to agree on a secret password with HQ, but the channel is tapped.
                                We will use <strong>Color Mixing</strong> to do this safely.
                                <br /><br />
                                <span className="text-yellow-500 italic">"Mixing paint is easy, but un-mixing it is impossible."</span>
                            </p>
                            <button onClick={nextStep} className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded uppercase tracking-wider transition-colors">
                                Start Protocol
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 1: SELECT SECRET */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Step 1: Choose Your Secret</h2>
                            <p className="text-slate-400 mb-12">Only YOU will see this color.</p>

                            <div className="flex gap-8 justify-center">
                                {COLORS.user_choices.map(c => (
                                    <button
                                        key={c.name}
                                        onClick={() => selectSecret(c)}
                                        className="group flex flex-col items-center gap-4"
                                    >
                                        <div
                                            className="w-24 h-24 rounded-full border-4 border-slate-700 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                            style={{ backgroundColor: c.hex }}
                                        />
                                        <span className="text-white font-bold uppercase tracking-widest group-hover:text-yellow-500 transition-colors">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: MIX WITH PUBLIC */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Step 2: The Mix</h2>
                            <p className="text-slate-400 mb-12">Combine your Secret with the Public Color (Yellow).</p>

                            <div className="flex items-center justify-center gap-8 mb-12">
                                {/* Secret */}
                                <div className="flex flex-col items-center">
                                    <Beaker className="w-16 h-16 mb-2" style={{ color: userSecret.hex }} />
                                    <span className="text-xs uppercase text-slate-500">My Secret</span>
                                </div>
                                <span className="text-2xl font-bold text-white">+</span>
                                {/* Public */}
                                <div className="flex flex-col items-center">
                                    <Beaker className="w-16 h-16 text-yellow-500 mb-2" />
                                    <span className="text-xs uppercase text-slate-500">Public (Yellow)</span>
                                </div>
                                <ArrowRight className="text-slate-600" />
                                {/* Result */}
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full border-2 border-slate-600 mb-2" style={{ backgroundColor: userSecret.mix_hex }}></div>
                                    <span className="text-xs uppercase text-white font-bold">Public Mix</span>
                                </div>
                            </div>

                            <button onClick={nextStep} className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-8 py-3 rounded border border-slate-500">
                                Mix Colors
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: EXCHANGE */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="text-center w-full"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Step 3: The Exchange</h2>
                            <p className="text-slate-400 mb-12">Exchanging public mixes over the insecure channel...</p>

                            <div className="relative w-full h-32 bg-slate-900/50 border-y border-slate-700 mb-8 flex items-center justify-between px-20">
                                {/* Start: User */}
                                <motion.div
                                    initial={{ x: 0, opacity: 1 }}
                                    animate={{ x: 300, opacity: 0 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    className="flex flex-col items-center"
                                >
                                    <Beaker className="w-12 h-12 mb-2" style={{ color: userSecret.mix_hex }} />
                                    <span className="text-[10px] uppercase text-slate-500">Sending Mix...</span>
                                </motion.div>

                                {/* Incoming: HQ */}
                                <motion.div
                                    initial={{ x: 0, opacity: 0 }}
                                    animate={{ x: -300, opacity: 1 }}
                                    transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                                    className="flex flex-col items-center"
                                >
                                    <Beaker className="w-12 h-12 mb-2" style={{ color: COLORS.hq_mix }} />
                                    <span className="text-[10px] uppercase text-emerald-500">Recieving HQ Mix</span>
                                </motion.div>

                                <Network className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800 w-32 h-32 -z-10" />
                            </div>

                            <button onClick={nextStep} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded">
                                Confirm Receipt
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: FINALIZE */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Step 4: The Final Key</h2>
                            <p className="text-slate-400 mb-12">Add YOUR Private Secret to HQ's Mix.</p>

                            <div className="flex items-center justify-center gap-8 mb-12">
                                {/* HQ Mix */}
                                <div className="flex flex-col items-center">
                                    <Beaker className="w-16 h-16 mb-2" style={{ color: COLORS.hq_mix }} />
                                    <span className="text-xs uppercase text-slate-500">HQ's Mix</span>
                                </div>
                                <span className="text-2xl font-bold text-white">+</span>
                                {/* My Secret */}
                                <div className="flex flex-col items-center">
                                    <Beaker className="w-16 h-16 mb-2" style={{ color: userSecret.hex }} />
                                    <span className="text-xs uppercase text-slate-500">My Secret</span>
                                </div>
                                <ArrowRight className="text-slate-600" />
                                {/* FINAL */}
                                <motion.div
                                    initial={{ scale: 0.5, rotate: -180 }}
                                    animate={{ scale: 1.2, rotate: 0 }}
                                    transition={{ type: "spring" }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-20 h-20 rounded-full bg-amber-900 border-4 border-amber-600 mb-2 shadow-[0_0_30px_rgba(180,83,9,0.6)] flex items-center justify-center">
                                        <Lock className="text-white w-8 h-8" />
                                    </div>
                                    <span className="text-sm uppercase text-amber-500 font-bold">SHARED KEY</span>
                                </motion.div>
                            </div>

                            <button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-4 rounded text-lg animate-pulse">
                                Establish Secure Line
                            </button>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center mt-20">
                            <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-white">CONNECTION SECURE</h2>
                            <p className="text-slate-400 mt-2 mb-8">Handshake Protocol Complete.</p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={exitMission}
                                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors"
                                >
                                    <Home size={20} /> Base Menu
                                </button>
                                <button
                                    onClick={() => startMission('mitm')}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors animate-bounce"
                                >
                                    Next Mission <Play size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default DiffieHellman;
