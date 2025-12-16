module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.ts",
  ],
  moduleNameMapper: {
    "react-native-webview": "<rootDir>/__mocks__/react-native-webview.tsx",
  },
};
