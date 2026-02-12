/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2DD4BF', // Teal
          light: '#5EEAD4',
          dark: '#14B8A6',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Amber
          light: '#FBBF24',
          dark: '#D97706',
        },
        accent: {
          teal: '#22D3EE',
          coral: '#FB7185',
          lime: '#A3E635',
        },
        ink: {
          DEFAULT: '#0B0D12',
          100: '#101521',
          200: '#151B2B',
          300: '#1B2336',
        },
        slate: {
          DEFAULT: '#CBD5F5',
          100: '#E2E8F0',
          200: '#C7D2FE',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2DD4BF 0%, #22D3EE 100%)',
        'gradient-dark': 'radial-gradient(120% 120% at 20% 0%, #1B2336 0%, #0B0D12 65%)',
        'gradient-card': 'linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, rgba(34, 211, 238, 0.08) 100%)',
        'grid-glow': 'radial-gradient(circle at 30% 20%, rgba(45, 212, 191, 0.18), transparent 55%), radial-gradient(circle at 80% 10%, rgba(251, 113, 133, 0.12), transparent 55%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.5), 0 0 30px rgba(236, 72, 153, 0.3)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        heading: ['Fraunces', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
