/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            // Cyberpunk Spy Palette
            slate: {
                850: '#151e2e',
                900: '#0f172a',
                950: '#020617', // Deep background
            },
            emerald: {
                400: '#34d399', // Primary Matrix/Terminal green
                500: '#10b981',
                900: '#064e3b', // Dark green background
            },
            neon: {
                blue: '#00f3ff', // Tron-like blue
                pink: '#ff00ff', // Cyberpunk pink
                purple: '#bc13fe',
            },
        },
        fontFamily: {
            mono: ['"Fira Code"', 'monospace'], // Hacker vibes
        },
        animation: {
            'glitch': 'glitch 1s linear infinite',
            'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
            glitch: {
                '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                '62%': { transform: 'translate(0,0) skew(5deg)' },
            }
        }
      },
    },
    plugins: [],
  }
