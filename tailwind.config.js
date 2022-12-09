/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'bounce-short': 'bounce 1s ease-in-out 5',
      },
      screens: {
        betterhover: { raw: '(hover: hover)' },
      },
      colors: {
        digiDefault: '#FFF2D9',
      },
    },
  },
  plugins: [],
};
