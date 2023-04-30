/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/utils/**/*.{js,ts,jsx,tsx}",
    "./src/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15D47E',
        dark: "#1C1C1C",
        darkGreen: '#00241D',
        bgGreen: '#151F1D'
      },

      fontFamily: {
        sans: "GeneralSans-Variable, Manrope, sans-serif",
      },

      gridTemplateColumns: {
        masonry: "repeat(auto-fill, minmax(300px, 1fr))",
      },

      gridTemplateRows: {
        masonry: "masonry",
      },
    },
  },

  safelist: [
    "rounded-t-none",
    "rounded-t-sm",
    "rounded-t-md",
    "rounded-t-lg",
    "rounded-t-xl",
    "rounded-t-2xl",
    "rounded-t-3xl",
    "rounded-t-[32px]",
    "bg-green-400",
    "border-green-400",
    "scale-100",
    "scale-95",
    "scale-90",
    "scale-80",
    "scale-75",
    "scale-70",
    "scale-60",
    "scale-50",
    "flex-col",
    "flex-col-reverse",
    "text-[#11111]",
  ],

  plugins: [require("@headlessui/tailwindcss")({ prefix: "ui" })],
};
