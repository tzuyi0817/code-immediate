/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        secondary: '#444857',
      },
      animation: {
        popup: 'popup-in 0.3s',
      },
      keyframes: {
        'popup-in': {
          from: {
            opacity: 0,
            transform: 'scale(0.9)',
          },
          to: {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
