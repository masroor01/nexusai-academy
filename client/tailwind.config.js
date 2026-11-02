/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          dark: '#0a0d14',
          card: '#111726',
          border: '#1e293b',
          accent: '#3b82f6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          purple: '#8b5cf6',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
