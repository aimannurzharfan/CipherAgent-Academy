# CipherAgent Academy

An interactive web game that teaches core cryptography through three short missions: the Rail Fence cipher, the Diffie-Hellman key exchange, and defending a key exchange against a man-in-the-middle attack. A built-in tutor watches your progress and steps in with hints when you get stuck.

**[Play it live](https://agentacademy-olxen5ua7-aiman-nurzharfans-projects.vercel.app/)**

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss&logoColor=white)

## The missions

Pick a mission from the map. Each one teaches a single idea by making you use it.

| Mission | What you do | What you learn |
| --- | --- | --- |
| 1. Rail Fence cipher | Rebuild a scrambled message on a zig-zag rail grid | Transposition ciphers |
| 2. Diffie-Hellman handshake | Mix public and private "paint" colours to agree on a shared colour with HQ, without ever sending your private one | Public-key exchange and shared secrets |
| 3. The interception | Spot and stop attacker packets trying to hijack a key exchange between Alice and Bob | Man-in-the-middle attacks and why authentication matters |

## CyberTutor

The tutor tracks how each mission is going. If you fail a puzzle or stall on a step, it pushes a hint card for that exact concept, straight from a built-in knowledge base. You can also ask it questions in your own words. With a Gemini key set, those answers come from Google Gemini through a small serverless function, so the key never reaches the browser. Without a key, the tutor still answers from its built-in notes.

## Tech stack

- React 19 with Vite
- Tailwind CSS
- Framer Motion for drag-and-drop and transitions
- Cryptography logic written from scratch in JavaScript
- Vercel serverless function (`/api/tutor`) for Gemini

## Run it locally

```bash
git clone https://github.com/aimannurzharfan/CipherAgent-Academy.git
cd CipherAgent-Academy
npm install
```

To let Gemini answer the tutor's free-text questions, create a `.env` file in the project root (it is gitignored):

```
GEMINI_API_KEY=your_key_here
```

Keep the variable name without a `VITE_` prefix, so Vite never bundles it into the browser code. On Vercel, add the same variable under Project Settings > Environment Variables.

Then start it:

```bash
vercel dev     # full app: game plus the /api/tutor function
npm run dev    # game only; the tutor answers from its built-in notes
```

To check the key works:

```bash
node test-gemini.js
```
