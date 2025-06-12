const baseConfig = require("./eslint.base.config.js");

module.exports = {
  ...baseConfig,
  rules: {
    ...(baseConfig.rules),
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    curly: "error",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/consistent-type-imports": "error"
  }
};