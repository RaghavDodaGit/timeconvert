/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef7ff',
          100: '#d9edff',
          200: '#bce0ff',
          300: '#8ecdff',
          400: '#58b0ff',
          500: '#3690fc',
          600: '#266ff2',
          700: '#1f58de',
          800: '#1e49b3',
          900: '#1e408d',
          950: '#172855',
        },
        secondary: {
          50: '#f3f8fa',
          100: '#e7f0f5',
          200: '#c8dfe9',
          300: '#9bc5d7',
          400: '#67a6c0',
          500: '#4a8aa5',
          600: '#3f728c',
          700: '#365e74',
          800: '#315061',
          900: '#2c4352',
          950: '#1a2a36',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};