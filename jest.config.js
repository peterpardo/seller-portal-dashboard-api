const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // Look for tests inside the `tests/__tests__` folder
  testMatch: ["**/tests/__tests__/**/*.test.ts"],

  // Run setup file before tests (for DB reset/disconnect, etc.)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Makes module resolution consistent with TS
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
};
