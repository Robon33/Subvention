/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1A1A18",
        cta: "#4CAF7D",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "count-up": "countUp 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
}
