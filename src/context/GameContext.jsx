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

    const exitMission = () => {
        setCurrentMission(null);
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

        // Sync currentMission safely using functional update to avoid race conditions
        setCurrentMission(prev => {
            if (prev && prev.id === missionId) {
                return { ...prev, status: 'completed' };
            }
            return prev;
        });
    };

    const failMission = (missionId) => {
        // Logic for repeated failures could trigger AI hints here
        console.log(`Mission ${missionId} failed.`);
    };

    const [mistakeCount, setMistakeCount] = useState(0);
    const [lastError, setLastError] = useState(null);
    const [lastEvent, setLastEvent] = useState(null);

    const recordMistake = (errorType = 'general') => {
        setMistakeCount(prev => prev + 1);
        setLastError({ type: errorType, timestamp: Date.now() });
    };

    const triggerEvent = (eventType, data = {}) => {
        setLastEvent({ type: eventType, data, timestamp: Date.now() });
    };

    // Reset mistakes when mission changes
    useEffect(() => {
        setMistakeCount(0);
    }, [currentMission]);

    return (
        <GameContext.Provider value={{
            agentName,
            progress,
            missionState,
            currentMission,
            registerAgent,
            startMission,
            exitMission,
            completeMission,
            failMission,
            mistakeCount,
            recordMistake,
            lastError,
            lastEvent,
            triggerEvent
        }}>
            {children}
        </GameContext.Provider>
    );
}
