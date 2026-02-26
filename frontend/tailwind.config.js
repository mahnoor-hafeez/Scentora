/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        scentora: {
          rose: '#e8b4b8',
          blush: '#f5e6e8',
          sand: '#faf3e8',
          sage: '#9ca986',
          stone: '#6b5b6b',
          noir: '#2d2a2e',
        },
      },
    },
  },
  plugins: [],
};
