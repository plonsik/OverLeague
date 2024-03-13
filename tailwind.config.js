/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/frontend/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        beaufort: ["Beaufort", "serif"],
      },
    },
  },
  plugins: [],
};
