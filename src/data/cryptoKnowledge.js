export const CRYPTO_KNOWLEDGE = {
    "rail-fence": {
        title: "Rail Fence Cipher",
        keywords: ["rail", "fence", "zig", "zag", "transposition", "rows", "offset"],
        simpleExplanation: "The Rail Fence cipher is a simple Transposition Cipher. It moves letters in a zig-zag pattern. For 2 rows, it simply alternates: Top, Bottom, Top, Bottom.",
        hint: "Just alternate the letters! First one goes Top, second goes Bottom, third goes Top..."
    },
    "diffie-hellman": {
        title: "Diffie-Hellman Key Exchange",
        keywords: ["diffie", "hellman", "exchange", "public", "private", "shared", "secret", "paint", "color"],
        simpleExplanation: "Diffie-Hellman allows two parties to create a shared secret over an insecure channel. Think of it like mixing paint: you exchange your public mixture, add your private color, and end up with the same final secret color, without ever revealing your private color.",
        hint: "Combine your private color with the public mixture to generate the shared secret."
    },
    "mitm": {
        title: "Man-in-the-Middle Attack",
        keywords: ["mitm", "man", "middle", "intercept", "attack", "eavesdrop", "mallory"],
        simpleExplanation: "In a Man-in-the-Middle (MITM) attack, an attacker sits between two communicating parties. They intercept the messages, potentially reading or altering them, while the original parties believe they are talking directly to each other.",
        hint: "Watch out for intermediate keys being exchanged. If the keys match the attacker's, the channel is compromised."
    },
    "general": {
        title: "Cryptography Training",
        keywords: [],
        simpleExplanation: "I am CyberTutor, your guide to cryptography. I can help you understand Rail Fence, Diffie-Hellman, and Man-in-the-Middle attacks.",
        hint: "Select a mission to get started or ask me specifically about a cipher."
    }
};
