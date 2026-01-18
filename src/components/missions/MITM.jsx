import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Shield, ShieldAlert, Bug, CheckCircle, XCircle, RotateCcw, Home, Play } from 'lucide-react';

const PACKET_SPEED = 2.5; // Seconds to cross
const SPAWN_INTERVAL = 1200; // ms
const TOTAL_PACKETS = 15;
const BUG_COUNT = 6;
const MAX_MISSES = 2; // Lose on 2nd miss

const MITM = () => {
    const { completeMission, recordMistake, triggerEvent, exitMission, startMission } = useGame();

    // Game State
    const [status, setStatus] = useState('briefing'); // briefing, active, success, failed
    const [packets, setPackets] = useState([]);
    const [missedBugs, setMissedBugs] = useState(0);
    const [bugsCaught, setBugsCaught] = useState(0);
    const [waveIndex, setWaveIndex] = useState(0); // Which packet from the level array to spawn next

    // Level Data (Fixed Wave)
    const [levelData, setLevelData] = useState([]);
    const warnedRef = useRef(false); // Valid Ref to track if we warned via AI already
    const caughtRef = useRef(new Set()); // Track caught IDs to prevent ghost misses

    // Initialize Level
    const initLevel = () => {
        // Create array of 15 items: 6 bugs, 9 safe
        let level = Array(BUG_COUNT).fill({ type: 'bug' }).concat(Array(TOTAL_PACKETS - BUG_COUNT).fill({ type: 'safe' }));
        // Shuffle
        for (let i = level.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [level[i], level[j]] = [level[j], level[i]];
        }
        setLevelData(level);
        setPackets([]);
        setMissedBugs(0);
        setBugsCaught(0);
        setWaveIndex(0);
        warnedRef.current = false;
        caughtRef.current.clear();
        setStatus('active');
    };

    // Game Loop
    useEffect(() => {
        if (status !== 'active') return;

        const spawnTimer = setInterval(() => {
            if (waveIndex < TOTAL_PACKETS) {
                const nextPacketType = levelData[waveIndex].type;
                const newPacket = {
                    id: Date.now() + Math.random(),
                    isBug: nextPacketType === 'bug',
                };
                setPackets(prev => [...prev, newPacket]);
                setWaveIndex(prev => prev + 1);
            } else {
                // Wave Initialized. Wait for clear.
                // If all packets gone and we are still active:
                if (packets.length === 0) {
                    clearInterval(spawnTimer);
                    // Check Win
                    if (missedBugs < MAX_MISSES) {
                        setStatus('success');
                        setTimeout(() => completeMission('mitm'), 1500);
                    }
                }
            }
        }, SPAWN_INTERVAL);

        return () => clearInterval(spawnTimer);
    }, [status, waveIndex, levelData, packets.length, missedBugs, completeMission]);

    // Check Win/Fail after packet clear
    useEffect(() => {
        if (status === 'active' && waveIndex >= TOTAL_PACKETS && packets.length === 0) {
            if (missedBugs < MAX_MISSES) {
                setStatus('success');
                setTimeout(() => completeMission('mitm'), 1500);
            }
        }
    }, [packets.length, status, waveIndex, missedBugs, completeMission]);

    // Packet Click Handler
    // Using onMouseDown for faster perceived response
    const handlePacketInteract = (e, id, isBug) => {
        e.preventDefault();
        e.stopPropagation();

        if (isBug) {
            caughtRef.current.add(id); // Mark as caught immediately
            // Remove immediately
            setPackets(prev => prev.filter(p => p.id !== id));
            setBugsCaught(prev => prev + 1);
        }
    };

    const onPacketComplete = (p) => {
        if (status !== 'active') return;
        if (caughtRef.current.has(p.id)) return; // Ignore if already caught

        if (p.isBug) {
            // Missed a bug!
            const newMisses = missedBugs + 1;
            setMissedBugs(newMisses);

            if (newMisses >= MAX_MISSES) {
                setStatus('failed');
                recordMistake('breach_critical');
            } else {
                // First miss
                recordMistake('breach');
                if (!warnedRef.current) {
                    triggerEvent('mitm_first_breach'); // Only trigger once
                    warnedRef.current = true;
                }
            }
        }
        // Remove from DOM
        setPackets(prev => prev.filter(pkt => pkt.id !== p.id));
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <h1 className="text-xl font-bold mb-8 text-white uppercase tracking-widest border-b border-red-500 pb-2 z-10 w-full max-w-4xl text-center">
                Mission: Firewall Defense
            </h1>

            {status === 'briefing' && (
                <div className="text-center max-w-lg bg-slate-900/80 p-8 rounded-xl border border-red-900/50 backdrop-blur-sm z-20">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Threat Intelligence</h2>
                    <p className="text-slate-400 mb-6">
                        A wave of <strong>{TOTAL_PACKETS} packets</strong> is incoming.<br />
                        There are <strong>{BUG_COUNT} Red Bugs</strong> hidden in the stream.<br />
                        <br />
                        <span className="text-red-400 font-bold block">DO NOT LET 2 BUGS PASS.</span>
                    </p>
                    <button onClick={initLevel} className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded uppercase tracking-widest transition-colors animate-pulse">
                        Start Defense
                    </button>
                </div>
            )}

            {status === 'success' && (
                <div className="text-center z-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white">THREAT NEUTRALIZED</h2>
                        <p className="text-slate-400 mt-2 mb-8">Firewall integrity maintained.</p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={exitMission}
                                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors"
                            >
                                <Home size={20} /> Base Menu
                            </button>
                            <button
                                onClick={() => startMission('rail-fence')}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors animate-bounce"
                            >
                                Next Mission <Play size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {status === 'failed' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center z-20 bg-black/90 p-8 rounded-xl border border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                    <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-3xl font-bold text-red-500">MISSION FAILED</h2>
                    <p className="text-slate-400 mt-2">Too many breaches! The hacker got in.</p>
                    <div className="flex flex-col gap-3 mt-6 w-full max-w-xs mx-auto">
                        <button
                            onClick={initLevel}
                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors w-full"
                        >
                            <RotateCcw size={16} /> Retry Wave
                        </button>
                        <button
                            onClick={exitMission}
                            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded uppercase font-bold tracking-widest transition-colors w-full"
                        >
                            <Home size={16} /> Base Menu
                        </button>
                    </div>
                </motion.div>
            )}

            {status === 'active' && (
                <>
                    {/* HUD */}
                    <div className="absolute top-4 right-4 z-10 bg-slate-900/80 p-4 rounded border border-slate-700 backdrop-blur-sm shadow-xl">
                        <div className="text-xs text-slate-500 font-mono tracking-widest mb-1">SYSTEM STATUS</div>
                        <div className="flex gap-4">
                            <div>
                                <div className="text-[10px] text-slate-400">PACKETS</div>
                                <div className="text-xl font-bold text-white">{waveIndex}/{TOTAL_PACKETS}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400">BUGS CAUGHT</div>
                                <div className="text-xl font-bold text-emerald-400">{bugsCaught}/{BUG_COUNT}</div>
                            </div>
                            <div>
                                <div className="text-[10px] text-slate-400">HEALTH</div>
                                <div className="flex gap-1 mt-1">
                                    {[...Array(MAX_MISSES)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded-full border border-red-500 ${i < (MAX_MISSES - missedBugs) ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-transparent opacity-20'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-40 bg-slate-900/50 border-y border-slate-700 relative flex items-center justify-between px-20 overflow-hidden">
                        {/* Alice */}
                        <div className="relative z-10 w-24 h-24 bg-blue-900/80 rounded-full flex flex-col items-center justify-center border-2 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <span className="text-xs font-bold text-white">ALICE</span>
                            <span className="text-[9px] text-blue-400 mt-1">SENDER</span>
                        </div>

                        {/* Bob */}
                        <div className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border-2 transition-colors duration-300 ${missedBugs > 0 ? 'bg-red-900/20 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-blue-900/80 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`}>
                            <span className="text-xs font-bold text-white">BOB</span>
                            <span className="text-[9px] text-blue-400 mt-1">RECEIVER</span>
                        </div>

                        {/* Wire */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-0">
                            <div className="absolute top-0 left-0 h-full w-full bg-blue-500/10 animate-pulse"></div>
                        </div>

                        {/* Packets */}
                        <AnimatePresence>
                            {packets.map(p => (
                                <motion.div
                                    key={p.id}
                                    initial={{ left: '150px' }} // Start near Alice
                                    animate={{ left: 'calc(100% - 150px)' }} // End near Bob
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: PACKET_SPEED, ease: "linear" }}
                                    onAnimationComplete={() => onPacketComplete(p)}
                                    // Robust Click Handling
                                    onMouseDown={(e) => handlePacketInteract(e, p.id, p.isBug)}
                                    // onClick={(e) => handlePacketInteract(e, p.id, p.isBug)} // Removed redundant listener
                                    className={`
                                        absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform z-20 group
                                        ${p.isBug ? 'bg-red-600 shadow-[0_0_15px_red] z-30' : 'bg-emerald-500/20 border border-emerald-500/50'}
                                    `}
                                >
                                    {p.isBug ? (
                                        <Bug size={24} className="text-black group-hover:rotate-12 transition-transform" />
                                    ) : (
                                        <Shield size={20} className="text-emerald-400/50" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
};

export default MITM;
