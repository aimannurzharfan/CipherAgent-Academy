# CipherAgent Academy

**CipherAgent Academy** is an interactive cryptography learning platform designed to train aspiring operatives in the art of secure communication. Through a series of immersive missions, agents learn about classical and modern encryption techniques, key exchange protocols, and network security vulnerabilities.

![CipherAgent Academy Interface](https://via.placeholder.com/800x450?text=CipherAgent+Academy+Interface)

## 🚀 Mission Brief
Welcome to the Academy. Your training will consist of tactical simulations where you must master cryptographic concepts to succeed.

### 🗺️ Mission Control
Navigate the global network via the **Mission Map**. Select active nodes to begin your training operations.

### 🕵️ Active Missions

#### 1. Rail Fence Cipher (Transposition)
*   **Objective**: Decrypt intercepted messages by understanding transposition patterns.
*   **Mechanics**: Visualizes how the Rail Fence cipher rearranges characters across multiple "rails" (rows).
*   **Key Concept**: Transposition Ciphers.

#### 2. Diffie-Hellman Key Exchange
*   **Objective**: Securely agree on a shared secret with a partner over a public channel.
*   **Mechanics**: Step-by-step negotiation of colors (representing mathematical values) to generate a shared secret key without revealing private components.
*   **Key Concept**: Public Key Cryptography, Shared Secret derivation.

#### 3. Man-in-the-Middle (MITM) Attack
*   **Objective**: Intercept/Secure communications between two parties.
*   **Mechanics**: Simulate an attacker (Eve) intercepting keys between Alice and Bob to decrypt their private messages, or learn how to prevent such attacks.
*   **Key Concept**: Network Security, Key Authentication, Interception.

### 🤖 CyberTutor (AI Assistant)
Access the **CyberTutor** terminal for real-time tactical support.
*   **Powered by**: Google Gemini AI.
*   **Function**: Context-aware guidance, concept explanation, and mission hints.
*   **Usage**: Type your queries into the terminal to receive immediate intelligence.

---

## 🛠️ Tech Stack
This academy simulation is built with:
*   **Core**: React 19, Vite
*   **Styling**: TailwindCSS
*   **Animations**: Framer Motion
*   **AI Integration**: Google Generative AI (Gemini)

---

## ⚡ Installation & Deployment

### Prerequisites
*   Node.js (v18+)
*   npm

### Setup
1.  **Clone the Academy Repository**:
    ```bash
    git clone https://github.com/aimannurzharfan/CipherAgent-Academy.git
    cd CipherAgent-Academy
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the root directory and add your Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Initialize Simulation**:
    ```bash
    npm run dev
    ```

5.  **Access Portal**:
    Open your browser and navigate to `http://localhost:5173`.

---

## 📜 License
Classified. For Academy Eyes Only.
