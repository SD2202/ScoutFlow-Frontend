/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        card: "#1E293B",
        primary: "#3B82F6",
        accent: "#22C55E",
        text: "#E2E8F0",
      },
    },
  },
  plugins: [],
};