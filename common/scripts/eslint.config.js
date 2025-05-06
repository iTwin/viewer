const baseConfig = require("./eslint.base.config.js");

module.exports = [
    {
        ...baseConfig[0],
        rules: {
            ...(baseConfig[0].rules || {}),
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "react-hooks/exhaustive-deps": "warn",
        },
    },
];
