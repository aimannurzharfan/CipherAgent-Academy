import React, { useState, useEffect } from 'react';
import { useGame } from './context/GameContext';
import Layout from './components/layout/Layout';
import MissionMap from './components/ui/MissionMap';
import BriefingModal from './components/ui/BriefingModal';
import DiffieHellman from './components/missions/DiffieHellman';
import MITM from './components/missions/MITM';
import RailFence from './components/missions/RailFence';
import { motion, AnimatePresence } from 'framer-motion';

const StartScreen = ({ onStart }) => {
  const [name, setName] = useState('');

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="scanline"></div>

      <div className="relative z-10 text-center p-8 border border-slate-800 bg-slate-900/50 backdrop-blur-md rounded-xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">CIPHER<span className="text-emerald-500">AGENT</span></h1>
        <p className="text-slate-500 text-xs tracking-[0.5em] mb-8 uppercase">Academy Access Portal</p>

        <input
          type="text"
          placeholder="ENTER CODENAME"
          className="w-full bg-black/50 border border-slate-700 p-4 text-center text-emerald-400 font-mono text-xl focus:border-emerald-500 focus:outline-none mb-4 transition-all"
          value={name}
          onChange={e => setName(e.target.value.toUpperCase())}
        />

        <button
          disabled={!name.length}
          onClick={() => onStart(name)}
          className="w-full bg-emerald-600 text-white font-bold py-4 uppercase tracking-widest hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Initialize
        </button>
      </div>
    </div>
  )
}

function GameRoot() {
  const { agentName, registerAgent } = useGame();

  if (!agentName) {
    return <StartScreen onStart={registerAgent} />;
  }

  return <AppContent />;
}

function AppContent() {
  const { currentMission } = useGame();
  const [showBriefing, setShowBriefing] = useState(false);
  const [activeMissionData, setActiveMissionData] = useState(null);

  // Handle Mission Selection from Map
  useEffect(() => {
    if (currentMission) {
      console.log("Mission Selected:", currentMission);
      // If it's not completed, show briefing. If completed, maybe show map?
      if (currentMission.status !== 'completed') {
        setActiveMissionData(currentMission);
        setShowBriefing(true);
      }
    } else {
      setShowBriefing(false);
    }
  }, [currentMission]);

  const handleMissionAccept = () => {
    console.log("Mission Accepted");
    setShowBriefing(false);
  };

  const handleMissionDecline = () => {
    console.log("Mission Declined");
    setShowBriefing(false);
    window.location.href = "/";
  };

  return (
    <Layout>
      <BriefingModal
        mission={activeMissionData && showBriefing ? activeMissionData : null}
        onClose={handleMissionDecline}
        onStart={handleMissionAccept}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={showBriefing ? "map" : (currentMission?.id || "map")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          {(!currentMission || showBriefing) ? <MissionMap /> : (
            <>
              {currentMission.id === 'diffie-hellman' && <DiffieHellman />}
              {currentMission.id === 'mitm' && <MITM />}
              {currentMission.id === 'rail-fence' && <RailFence />}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <GameRoot />
  );
}
