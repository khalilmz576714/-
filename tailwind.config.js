/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        card: '#F0EBE3',
        sepia: '#D4C5B2',
        ink: '#4A3728',
        muted: '#9B8C7C',
        gold: '#C9A96E',
      },
      fontFamily: {
        serif: ['Georgia', '"Noto Serif SC"', 'serif'],
        sans: ['-apple-system', '"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '24px',
      },
    },
  },
  plugins: [],
};
