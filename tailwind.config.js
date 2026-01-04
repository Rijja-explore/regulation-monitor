/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0B1220',
        'bg-card': '#111A2E',
        'border-color': '#1F2A44',
        'text-primary': '#E6EAF2',
        'text-secondary': '#9AA4BF',
        'risk-green': '#1DB954',
        'risk-amber': '#F4C430',
        'risk-red': '#E5484D',
        'accent-blue': '#1A73E8',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathe': 'breathe 1.5s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
