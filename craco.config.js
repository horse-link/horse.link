module.exports = {
  jest: {
    configure: {
      roots: ["<rootDir>/src", "<rootDir>/__tests__"],
      testMatch: ["<rootDir>/__tests__/**/*.{spec,test}.{js,jsx,ts,tsx}"]
    }
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")]
    }
  }
};
