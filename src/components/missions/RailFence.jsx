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
    const [selectedLetterId, setSelectedLetterId] = useState(null);

    // Initialize random word
    useEffect(() => {
        const word = WORDS[Math.floor(Math.random() * WORDS.length)];
        const wordObj = word.split('').map((char, i) => ({ id: `${i}-${char}`, char }));
        setTargetWord(wordObj);
        setLetters([...wordObj]);
        setRails({ 0: [], 1: [] });
        setPlacements({});
        setSelectedLetterId(null);
    }, []);

    const handleLetterClick = (letterId) => {
        if (selectedLetterId === letterId) {
            setSelectedLetterId(null); // Deselect
        } else {
            setSelectedLetterId(letterId);
        }
    };

    const handleRailClick = (railIndex) => {
        if (!selectedLetterId) return;

        placeLetter(selectedLetterId, railIndex);
        setSelectedLetterId(null);
    };

    const placeLetter = (letterId, railIndex) => {
        const currentIndex = Object.values(placements).filter(r => r !== null).length;

        // 2-Rail Sequence: 0, 1, 0, 1... (Even=0, Odd=1)
        const expectedRail = currentIndex % 2;

        // Strict Letter Validation: Must match the target character at the current index
        const selectedChar = letters.find(l => l.id === letterId)?.char;
        const targetChar = targetWord[currentIndex]?.char;

        if (selectedChar !== targetChar) {
            recordMistake('wrong_letter');
            return;
        }

        if (railIndex !== expectedRail) {
            recordMistake('rail_placement');
            return; // Don't crash or move, just record mistake
        }

        setPlacements(prev => ({ ...prev, [letterId]: railIndex }));
        setRails(prev => ({ ...prev, [railIndex]: [...prev[railIndex], letterId] }));
        setLetters(prev => prev.filter(l => l.id !== letterId));

        if (currentIndex + 1 === targetWord.length) {
            setSolved(true);
            setTimeout(() => completeMission('rail-fence'), 1500);
        }
    };

    const returnToTray = (event, letterId, railIndex) => {
        event.stopPropagation(); // Prevent rail click
        // Remove from rail
        setRails(prev => ({
            ...prev,
            [railIndex]: prev[railIndex].filter(id => id !== letterId)
        }));

        // Remove from placements
        setPlacements(prev => {
            const newPlacements = { ...prev };
            delete newPlacements[letterId];
            return newPlacements;
        });

        // Add back to letters pool
        const char = targetWord.find(l => l.id === letterId)?.char;
        if (char) {
            setLetters(prev => [...prev, { id: letterId, char }]);
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
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                exitMission();
                            }}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors"
                        >
                            <Home size={20} /> Base Menu
                        </button>
                    </div>
                </motion.div>
            ) : (
                <>
                    {/* Letter Pool (Holding Bay) */}
                    <div className="flex gap-4 mb-8 bg-slate-900/80 p-6 rounded-lg min-h-[100px] border border-slate-700 shadow-inner w-full max-w-3xl justify-center items-center">
                        {letters.length === 0 && <span className="text-slate-600 italic">Holding Bay Empty</span>}
                        {letters.map(l => {
                            const isSelected = selectedLetterId === l.id;
                            return (
                                <motion.div
                                    layout
                                    layoutId={l.id}
                                    onClick={() => handleLetterClick(l.id)}
                                    key={l.id}
                                    className={`w-14 h-14 text-xl font-bold flex items-center justify-center rounded cursor-pointer transition-all ${isSelected
                                        ? 'bg-neon-blue text-black shadow-[0_0_20px_#00f3ff] scale-110 ring-2 ring-white'
                                        : 'bg-slate-800 text-neon-blue border border-neon-blue/30 hover:bg-slate-700 hover:scale-105'
                                        }`}
                                >
                                    {l.char}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Rails */}
                    <div className="w-full max-w-4xl space-y-8 relative mt-4">
                        {/* Visual Zig-Zag Line */}
                        <svg className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 -z-10 opacity-20 pointer-events-none">
                            {/* Decorative background element */}
                        </svg>

                        {[0, 1].map(railIndex => (
                            <div
                                key={railIndex}
                                onClick={() => handleRailClick(railIndex)}
                                className={`h-24 border-2 flex items-center gap-4 px-8 relative transition-colors cursor-pointer ${selectedLetterId
                                    ? 'border-neon-blue/50 bg-neon-blue/5 hover:bg-neon-blue/10'
                                    : 'border-slate-700 bg-slate-800/30'
                                    } rounded-lg`}
                            >
                                <span className="absolute left-4 -top-3 bg-slate-950 px-2 text-slate-400 text-xs font-mono uppercase tracking-widest">
                                    {railIndex === 0 ? 'TOP RAIL (First)' : 'BOTTOM RAIL (Second)'}
                                </span>
                                {rails[railIndex].map(lid => {
                                    const char = targetWord.find(l => l.id === lid)?.char;
                                    return (
                                        <motion.div
                                            layout
                                            layoutId={lid}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            key={lid}
                                            onClick={(e) => returnToTray(e, lid, railIndex)}
                                            className="w-12 h-12 bg-emerald-600 text-white font-bold flex items-center justify-center rounded shadow-lg border border-emerald-400 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-400 transition-colors relative group"
                                        >
                                            {char}
                                            <span className="absolute -top-8 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Return</span>
                                        </motion.div>
                                    );
                                })}
                                {selectedLetterId && (
                                    <div className="ml-auto text-neon-blue/50 text-sm animate-pulse">
                                        CLICK TO PLACE
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-slate-500 text-sm">
                        <p>1. Click a letter to SELECT.</p>
                        <p>2. Click a Rail to PLACE.</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default RailFence;
