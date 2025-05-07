const config = require("../../../common/scripts/eslint.config.js");

module.exports = {
  ...config,
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...config.languageOptions.parserOptions,
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json", "./tsconfig.test.json"],
    },
  },
};