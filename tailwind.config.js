/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/utils/**/*.{js,ts,jsx,tsx}',
    './src/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15D47E',
        dark: '#1C1C1C',
        darkGreen: '#00241D',
        bgGreen: '#151F1D',
        bgDarkGreen: 'rgba(21, 212, 126, 0.3)',
        bgDark: 'rgba(21, 212, 126, 0.1)',
        bgKeysDark: 'rgba(21, 212, 126, 1)',
        bgToggle: 'rgba(21, 31, 29, 1)',
        bgOnToggle: 'rgba(21, 212, 126, 1)',
      },

      fontFamily: {
        sans: 'GeneralSans-Variable, Manrope, sans-serif',
      },

      gridTemplateColumns: {
        masonry: 'repeat(auto-fill, minmax(300px, 1fr))',
      },

      gridTemplateRows: {
        masonry: 'masonry',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out',
        'spin-short': 'spin 1s ease-in-out',
      },
    },
  },

  safelist: [
    'rounded-t-none',
    'rounded-t-sm',
    'rounded-t-md',
    'rounded-t-lg',
    'rounded-t-xl',
    'rounded-t-2xl',
    'rounded-t-3xl',
    'rounded-t-[32px]',
    'bg-green-400',
    'border-green-400',
    'scale-100',
    'scale-95',
    'scale-90',
    'scale-80',
    'scale-75',
    'scale-70',
    'scale-60',
    'scale-50',
    'flex-col',
    'flex-col-reverse',
    'text-[#11111]',
  ],

  plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })],
};
