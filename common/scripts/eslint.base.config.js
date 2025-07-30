const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const prettier = require("eslint-plugin-prettier");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const reactHooks = require("eslint-plugin-react-hooks");
const iTwinPlugin = require("@itwin/eslint-plugin");
const reactApp = require("eslint-config-react-app");

module.exports = {
  files: ["**/*.{ts,tsx}"],
  ...iTwinPlugin.configs.iTwinjsRecommendedConfig,
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  plugins: {
    "@typescript-eslint": tsPlugin,
    react,
    "simple-import-sort": simpleImportSort,
    "react-hooks": reactHooks,
    "react-app": reactApp,
    prettier,
  },
  rules: {
    ...react.configs.recommended.rules,
    "no-console": "off",
    "no-var": "error",
    "import/prefer-default-export": "off",
    radix: "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    "@typescript-eslint/no-deprecated": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect",
    }
  }
};  