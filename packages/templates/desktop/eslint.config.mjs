import iTwinPlugin from "@itwin/eslint-plugin";
import reactPlugin from "eslint-plugin-react";

export default [
  {
    files: ["src/frontend/**/*.{ts,tsx}"],
    ...iTwinPlugin.configs.uiConfig,
  },
  {
    files: ["src/frontend/**/*.{ts,tsx}"],
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
    },
  },
  {
    files: ["src/backend/**/*.ts", "src/common/**/*.ts"],
    ...iTwinPlugin.configs.iTwinjsRecommendedConfig,
    languageOptions: {
      ...iTwinPlugin.configs.iTwinjsRecommendedConfig.languageOptions,
      parserOptions: {
        ...iTwinPlugin.configs.iTwinjsRecommendedConfig.languageOptions.parserOptions,
        project: ["tsconfig.backend.json"]
      }
    }
  }
];