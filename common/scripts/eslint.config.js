const baseConfig = require("./eslint.base.config.js");

module.exports = {
  ...baseConfig,
  rules: {
    ...(baseConfig.rules || {}),
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/prefer-nullish-coalescing": "warn",
    "react-hooks/exhaustive-deps": "warn",
  },
};