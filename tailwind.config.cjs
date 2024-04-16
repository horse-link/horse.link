/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'JetBrains Mono'", ...defaultTheme.fontFamily.sans],
        basement: [
          "Basement Grotesk",
          "'JetBrains Mono'",
          ...defaultTheme.fontFamily.sans
        ]
      },
      colors: {
        "hl-background": "#000",
        "hl-primary": "#fff",
        "hl-secondary": "#ff431c",
        "hl-tertiary": "#b1b1b1",
        "hl-background-secondary": "#151515",
        "hl-border": "#3b3b3b",
        "hl-outstanding": "#f44336"
      },
      screens: {
        "3xl": "1900px"
      },
      letterSpacing: {
        tightest: "-0.1em"
      }
    }
  },
  plugins: [require("tailwind-scrollbar")]
};
