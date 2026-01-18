import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const MISSIONS = [
    {
        id: 'diffie-hellman',
        title: 'Mission 1: The Handshake',
        description: 'Establish a secure line with HQ using the Diffie-Hellman Color Exchange.',
        locked: false,
        status: 'pending', // pending, active, completed, failed
        path: '/mission/diffie-hellman'
    },
    {
        id: 'mitm',
        title: 'Mission 2: The Interception',
        description: 'A hacker is on the line. Identify and neutralize the Man-in-the-Middle attack.',
        locked: true,
        status: 'pending',
        path: '/mission/mitm'
    },
    {
        id: 'rail-fence',
        title: 'Mission 3: The Payload',
        description: 'Decode the intercepted blueprint using the Rail Fence Cipher.',
        locked: true,
        status: 'pending',
        path: '/mission/rail-fence'
    }
];

export function GameProvider({ children }) {
    const [agentName, setAgentName] = useState(localStorage.getItem('cipher_agent_name') || '');
    const [progress, setProgress] = useState(parseInt(localStorage.getItem('cipher_ticket_progress') || '0'));
    const [missionState, setMissionState] = useState(MISSIONS);
    const [currentMission, setCurrentMission] = useState(null);

    // Persist basic data
    useEffect(() => {
        if (agentName) localStorage.setItem('cipher_agent_name', agentName);
        localStorage.setItem('cipher_ticket_progress', progress);
    }, [agentName, progress]);

    // Unlock levels based on progress
    useEffect(() => {
        setMissionState(prev => prev.map((m, index) => ({
            ...m,
            locked: index > progress
        })));
    }, [progress]);

    const registerAgent = (name) => {
        setAgentName(name);
    };

    const startMission = (missionId) => {
        const mission = missionState.find(m => m.id === missionId);
        if (mission && !mission.locked) {
            setCurrentMission(mission);
        }
    };

    const completeMission = (missionId) => {
        // Find index
        const index = missionState.findIndex(m => m.id === missionId);
        if (index === progress) {
            // Only advance progress if completing the *current* highest level
            setProgress(p => p + 1);
        }

        setMissionState(prev => prev.map(m =>
            m.id === missionId ? { ...m, status: 'completed' } : m
        ));
    };

    const failMission = (missionId) => {
        // Logic for repeated failures could trigger AI hints here
        console.log(`Mission ${missionId} failed.`);
    };

    return (
        <GameContext.Provider value={{
            agentName,
            progress,
            missionState,
            currentMission,
            registerAgent,
            startMission,
            completeMission,
            failMission
        }}>
            {children}
        </GameContext.Provider>
    );
}
