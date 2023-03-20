module.exports = {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.(spec|test).(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {}]
  }
};
