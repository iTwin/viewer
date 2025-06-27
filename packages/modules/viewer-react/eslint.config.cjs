const config = require("../../../common/scripts/eslint.config.js");

module.exports = {
  ...config,
  ignores: ["./src/**/*.test.ts*"], // Ignore test files for now, to be removed later once exclusion from tsconfig is removed.
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...config.languageOptions.parserOptions,
      tsconfigRootDir: __dirname,
    },
  },
};