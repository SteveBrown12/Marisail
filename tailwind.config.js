/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.thin-scrollbar::-webkit-scrollbar': {
          width: '6px',
        },
        '.thin-scrollbar::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '.thin-scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: '#4A5568',
          borderRadius: '3px',
        },
        '.thin-scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#4A5568 transparent',
        },
      });
    },
  ],
}
