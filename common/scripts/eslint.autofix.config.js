const baseConfig = require("./eslint.base.config.js");

module.exports = [
    {
        ...baseConfig[0],
        rules: {
            "simple-import-sort/sort": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            curly: "error",
            "react-hooks/exhaustive-deps": "off",
            "@typescript-eslint/consistent-type-imports": "error"
          }
    }
];