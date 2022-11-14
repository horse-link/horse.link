module.exports = {
  jest: {
    configure: {
      roots: ["<rootDir>/src"],
      testMatch: ["<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}"]
    }
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")]
    }
  }
};
