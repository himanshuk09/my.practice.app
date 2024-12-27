/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#e31836",
        background: "#ffffff",
        secondary: "#f6f6f6",
        gray: {
          light: "#fdfdfd",
          lighter: "#fcfcfc",
          DEFAULT: "#ccccce",
          dark: "#cdcdcf",
        },
        black: "#000000",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
