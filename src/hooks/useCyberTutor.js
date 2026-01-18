import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CRYPTO_KNOWLEDGE } from '../data/cryptoKnowledge';

// Helper to get knowledge based on mission ID
const getMissionTopic = (missionId) => {
    if (!missionId) return 'general';
    if (missionId.includes('rail-fence')) return 'rail-fence';
    if (missionId.includes('diffie-hellman')) return 'diffie-hellman';
    if (missionId.includes('mitm')) return 'mitm';
    return 'general';
};

export const useCyberTutor = () => {
    const { currentMission, mistakeCount } = useGame();
    const [messages, setMessages] = useState([]);
    const [options, setOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    // Initial Welcome / Idle State
    useEffect(() => {
        // Safety Check: If no mission or undefined, show Base status
        if (!currentMission || currentMission === 'undefined' || !currentMission.title) {
            setMessages([{
                id: Date.now(),
                sender: 'ai',
                text: "Agent, you are back at Base. Select a mission from the map to begin.",
                isAi: true
            }]);
            setOptions([]);
            return;
        }

        // Active Mission
        setMessages([{
            id: Date.now(),
            sender: 'ai',
            text: `Agent, you have engaged mission: ${currentMission.title}. Awaiting orders.`,
            isAi: true
        }]);
        setOptions([
            { label: "Mission Objective?", action: "objective" },
            { label: "Review Rules", action: "rules" }
        ]);
    }, [currentMission]);

    // Mistake Trigger
    useEffect(() => {
        if (mistakeCount >= 3) {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: "Agent, I detect significant deviations in your decryption attempts. Do you require assistance?",
                isAi: true
            }]);
            setOptions([
                { label: "Show Hint", action: "hint" },
                { label: "Explain Concept", action: "explain" },
                { label: "I'll try again", action: "dismiss" }
            ]);
            setIsOpen(true);
        }
    }, [mistakeCount]);

    // Granular Error Trigger
    const { lastError } = useGame();
    useEffect(() => {
        if (!lastError) return;

        let errorMsg = "Anomaly detected.";
        switch (lastError.type) {
            case 'rail_placement':
                errorMsg = "Negative. The pattern is Top, Bottom, Top, Bottom. Try again.";
                break;
            case 'wrong_letter':
                errorMsg = "Incorrect sequence. Decryption requires precise character ordering. Check the sequence.";
                break;
            case 'private_leak':
                errorMsg = "SECURITY ALERT! Never transmit your Private Key directly. Mix it first!";
                break;
            case 'breach':
                errorMsg = "Firewall breached! You must enable active countermeasures immediately.";
                break;
            default:
                return; // Ignore generic errors handled by mistakeCount
        }

        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'ai',
            text: errorMsg,
            isAi: true
        }]);
        setIsOpen(true);
    }, [lastError]);

    // Scripted Event Trigger
    const { lastEvent } = useGame();
    useEffect(() => {
        if (!lastEvent) return;

        if (lastEvent.type === 'dh_exchange_step') {
            const color = lastEvent.data?.secretColor || 'Red';
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: `Wait! Why is this safe? Because mixing paint is easy, but un-mixing it is impossible! The Hacker can't separate your ${color} from the Yellow!`,
                isAi: true
            }]);
            setIsOpen(true);
        }

        if (lastEvent.type === 'mitm_first_breach') {
            setMessages(prev => [...prev, {
                id: Date.now(),
                sender: 'ai',
                text: "Agent! Breach detected! Do you require tactical assistance?",
                isAi: true
            }]);
            setOptions([
                { label: "Yes, Help", action: "explain" },
                { label: "No, I got this", action: "dismiss" }
            ]);
            setIsOpen(true);
        }
    }, [lastEvent]);

    const handleOptionClick = (action) => {
        const topic = getMissionTopic(currentMission?.id);
        const data = CRYPTO_KNOWLEDGE[topic] || CRYPTO_KNOWLEDGE['general'];

        let responseText = "";
        let newOptions = [];

        switch (action) {
            case 'objective':
                responseText = currentMission?.description || "Select a mission from the dashboard.";
                newOptions = [{ label: "How does this cipher work?", action: "explain" }];
                break;
            case 'rules':
            case 'explain':
                responseText = data.simpleExplanation;
                newOptions = [{ label: "Show Hint", action: "hint" }, { label: "Understood", action: "dismiss" }];
                break;
            case 'hint':
                responseText = `HINT: ${data.hint}`;
                newOptions = [{ label: "Understood", action: "dismiss" }];
                break;
            case 'dismiss':
                responseText = "Carry on, Agent.";
                newOptions = [{ label: "Help", action: "help" }]; // Back to idle
                break;
            case 'help':
                responseText = "How can I assist?";
                newOptions = [
                    { label: "Mission Objective?", action: "objective" },
                    { label: "Explain Cipher", action: "explain" }
                ];
                break;
            default:
                responseText = "Command not recognized.";
        }

        // Add User "Message" (the clicked option)
        const userMsg = { id: Date.now(), sender: 'user', text: `>> CMD: ${action.toUpperCase()}` };

        // Add AI Response
        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: responseText, isAi: true };

        setMessages(prev => [...prev, userMsg, aiMsg]);
        setOptions(newOptions);
    };

    return {
        messages,
        options,
        handleOptionClick,
        isOpen,
        setIsOpen
    };
};
