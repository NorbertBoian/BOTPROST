module.exports = {
  watchPathIgnorePatterns: [
    "db",
    "node_modules",
    "babel.config.js",
    "LICENSE",
    "README.md",
    "package.json",
    "package-lock.json",
  ],
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
};
