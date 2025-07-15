import iTwinPlugin from "@itwin/eslint-plugin";
import reactPlugin from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    ...iTwinPlugin.configs.uiConfig,
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
    },
  },
];