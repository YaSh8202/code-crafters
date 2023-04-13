/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {

    },
  },
  plugins: [require('@tailwindcss/typography'), require("daisyui")],
  darkMode: ['class', '[data-mode="dark"]'],
};

module.exports = config;
