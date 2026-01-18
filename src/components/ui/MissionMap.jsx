import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Check, Play, MapPin } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { cn } from '../../lib/utils';

const MissionMap = () => {
    const { missionState, progress, startMission } = useGame();

    return (
        <div className="h-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-4xl p-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-white tracking-[0.2em] uppercase drop-shadow-lg">
                    <span className="text-emerald-500">Global</span> Campaign Map
                </h2>

                <div className="flex items-center justify-between relative px-12">
                    {/* Connection Line */}
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-800 -z-10 mx-20">
                        <motion.div
                            className="h-full bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(progress / (missionState.length - 1)) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                    </div>

                    {missionState.map((mission, index) => {
                        const isLocked = mission.locked;
                        const isCompleted = mission.status === 'completed';
                        const isNext = !isLocked && !isCompleted;

                        return (
                            <motion.button
                                key={mission.id}
                                disabled={isLocked}
                                onClick={() => startMission(mission.id)}
                                whileHover={!isLocked ? { scale: 1.1 } : {}}
                                whileTap={!isLocked ? { scale: 0.95 } : {}}
                                className={cn(
                                    "relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300",
                                    isCompleted ? "border-emerald-500 bg-emerald-900/80 text-emerald-400" :
                                        isNext ? "border-neon-blue bg-slate-900 text-white shadow-[0_0_30px_#00f3ff50] animate-pulse-fast" :
                                            "border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed"
                                )}
                            >
                                {isCompleted ? <Check size={32} /> :
                                    isLocked ? <Lock size={24} /> :
                                        <Play size={32} className="ml-1" />}

                                {/* Label */}
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                                    <div className={cn(
                                        "text-xs font-bold uppercase tracking-wider py-1 px-2 rounded",
                                        isNext ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/30" : "text-slate-500"
                                    )}>
                                        Level {index + 1}
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1">{mission.title}</div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Ambient Map Decoration */}
            <div className="absolute bottom-8 right-8 text-right opacity-30">
                <div className="text-[10px] flex items-center justify-end gap-2 text-emerald-500">
                    <MapPin size={12} />
                    COORDINATES: 34.0522° N, 118.2437° W
                </div>
                <div className="text-[10px] text-slate-500">SECURE SERVER: US-WEST-1</div>
            </div>
        </div>
    );
};

export default MissionMap;
