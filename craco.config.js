module.exports = {
  jest: {
    configure: {
      roots: ["<rootDir>/src"],
      testMatch: ["<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}"],
      setupFiles: ["<rootDir>/jest.setEnv.ts"],
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
    }
  },
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")]
    }
  }
};
