/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cc: {
          bg: "var(--cc-bg)",
          "bg-secondary": "var(--cc-bg-secondary)",
          "bg-tertiary": "var(--cc-bg-tertiary)",
          surface: "var(--cc-surface)",
          "surface-hover": "var(--cc-surface-hover)",
          border: "var(--cc-border)",
          text: "var(--cc-text)",
          "text-secondary": "var(--cc-text-secondary)",
          "text-muted": "var(--cc-text-muted)",
          accent: "var(--cc-accent)",
          "accent-hover": "var(--cc-accent-hover)",
          "accent-subtle": "var(--cc-accent-subtle)",
          success: "var(--cc-success)",
          danger: "var(--cc-danger)",
          "nav-bg": "var(--cc-nav-bg)",
          "sidebar-bg": "var(--cc-sidebar-bg)",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};

module.exports = config;
