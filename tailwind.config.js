/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        neon: {
          blue: '#00d4ff',
          purple: '#b44fff',
          pink: '#ff2d78',
          cyan: '#00ffea',
          green: '#00ff88',
        },
        dark: {
          900: '#020408',
          800: '#060d16',
          700: '#0a1628',
          600: '#0f1f3a',
          500: '#152840',
        },
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.2)',
        'neon-purple': '0 0 20px rgba(180, 79, 255, 0.5), 0 0 60px rgba(180, 79, 255, 0.2)',
        'neon-pink': '0 0 20px rgba(255, 45, 120, 0.5), 0 0 60px rgba(255, 45, 120, 0.2)',
        'glow-sm': '0 0 10px rgba(0, 212, 255, 0.4)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(180, 79, 255, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'winner-glow': 'winnerGlow 1.5s ease-in-out infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        winnerGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 165, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.9), 0 0 100px rgba(255, 165, 0, 0.5)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
