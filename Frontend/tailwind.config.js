const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', ...fontFamily.sans],
      },
      // ADD KEYFRAMES BACK HERE
      keyframes: {
        logoSpin: {
          '0%': { transform: 'rotate(-360deg) scale(0.5)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        textBounce: {
          '0%': { transform: 'translateY(-50px) scale(0.9)', opacity: '0' },
          '60%': { transform: 'translateY(10px) scale(1.1)', opacity: 0.7 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        letterJump: { // Re-added letterJump keyframes
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(0.85) translateY(-5px)' },
        },
      },
      // ADD ANIMATION BACK HERE
      animation: {
        'letter-jump-hover-config': 'letterJump 0.2s ease-in-out', // New utility name
      },
    },
  },
  plugins: [],
}