/** tailwind.config.cjs **/
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 500: "#6366F1", 600: "#4F46E5" },
        dark:    { 700: "#2D2D2D", 800: "#1F1F1F", 900: "#121212" }
      }
    }
  },
  plugins: [],
};
