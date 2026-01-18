import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { CheckCircle, Home, Play } from 'lucide-react';

const WORDS = ["SECRET", "DEFEND", "ATTACK", "CIPHER", "ENIGMA", "SIGNAL"];

const RailFence = () => {
    const { completeMission, recordMistake, exitMission, startMission } = useGame();
    const [solved, setSolved] = useState(false);

    // Game State
    const [targetWord, setTargetWord] = useState([]); // Array of {id, char}
    const [letters, setLetters] = useState([]); // Pool
    const [rails, setRails] = useState({ 0: [], 1: [] }); // 2 Rails
    const [placements, setPlacements] = useState({});

    // Initialize random word
    useEffect(() => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const wordObj = word.split('').map((char, i) => ({ id: `${i}-${char}`, char }));
        setTargetWord(wordObj);
        setLetters([...wordObj]);
        setRails({ 0: [], 1: [] });
        setPlacements({});
    }, []);

    const handleDragEnd = (event, info, letterId) => {
        const y = info.point.y;
        const windowHeight = window.innerHeight;

        // Simple hit detection for 2 rails
        // Top Rail: < 60% height
        // Bottom Rail: > 60% height (approx)
        let targetRail = -1;
        if (y > windowHeight * 0.4 && y < windowHeight * 0.6) targetRail = 0;
        else if (y > windowHeight * 0.6 && y < windowHeight * 0.8) targetRail = 1;

        if (targetRail !== -1) {
            placeLetter(letterId, targetRail);
        }
    };

    const placeLetter = (letterId, railIndex) => {
        const currentIndex = Object.values(placements).filter(r => r !== null).length;

        // 2-Rail Sequence: 0, 1, 0, 1... (Even=0, Odd=1)
        const expectedRail = currentIndex % 2;

        if (railIndex !== expectedRail) {
            recordMistake('rail_placement');
            return;
        }

        setPlacements(prev => ({ ...prev, [letterId]: railIndex }));
        setRails(prev => ({ ...prev, [railIndex]: [...prev[railIndex], letterId] }));
        setLetters(prev => prev.filter(l => l.id !== letterId));

        if (currentIndex + 1 === targetWord.length) {
            setSolved(true);
            setTimeout(() => completeMission('rail-fence'), 1500);
        }
    };

    return (
        <div className="h-full flex flex-col items-center p-4 relative">
            <h1 className="text-xl font-bold mb-4 text-white uppercase tracking-widest border-b border-neon-blue pb-2">
                Mission: The Payload
            </h1>

            {solved ? (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center mt-20"
                >
                    <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-white mb-8">DECRYPTED</h2>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={exitMission}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors"
                        >
                            <Home size={20} /> Base Menu
                        </button>
                    </div>
                </motion.div>
            ) : (
                <>
                    {/* Letter Pool */}
                    <div className="flex gap-2 mb-8 bg-slate-900/50 p-4 rounded-lg min-h-[80px]">
                        {letters.map(l => (
                            <motion.div
                                drag
                                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                dragElastic={0.2}
                                dragMomentum={false}
                                onDragEnd={(e, info) => handleDragEnd(e, info, l.id)}
                                key={l.id}
                                className="w-12 h-12 bg-neon-blue text-black text-xl font-bold flex items-center justify-center rounded cursor-grab active:cursor-grabbing z-50 hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,243,255,0.4)]"
                            >
                                {l.char}
                            </motion.div>
                        ))}
                    </div>

                    {/* Rails */}
                    <div className="w-full max-w-3xl space-y-12 relative mt-8">
                        {/* Visual Zig-Zag Line */}
                        <svg className="absolute top-8 left-8 w-full h-[6.5rem] -z-10 opacity-30 pointer-events-none">
                            <defs>
                                <pattern id="zigzag" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                                    <path d="M 0 10 L 50 90 L 100 10" fill="none" stroke="#00f3ff" strokeWidth="2" />
                                </pattern>
                            </defs>
                            {/* Just drawing a dynamic path is complex without exact coords. Use a simpler static hint opacity */}
                        </svg>

                        {[0, 1].map(railIndex => (
                            <div
                                key={railIndex}
                                className="h-20 border-b-2 border-slate-700 flex items-center gap-6 px-8 bg-slate-800/20 relative backdrop-blur-sm"
                            >
                                <span className="absolute left-0 -top-6 text-slate-500 text-xs font-mono uppercase tracking-widest">
                                    {railIndex === 0 ? 'TOP RAIL (First)' : 'BOTTOM RAIL (Second)'}
                                </span>
                                {rails[railIndex].map(lid => {
                                    const char = targetWord.find(l => l.id === lid)?.char;
                                    return (
                                        <motion.div
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            key={lid}
                                            className="w-12 h-12 bg-emerald-600 text-white font-bold flex items-center justify-center rounded shadow-lg border border-emerald-400"
                                        >
                                            {char}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default RailFence;
