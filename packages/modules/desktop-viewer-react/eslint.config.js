const config = require("../../../common/scripts/eslint.config.js");

module.exports = [
    {
        ...config[0],
        languageOptions: {
            ...config[0].languageOptions,
            parserOptions: {
                ...config[0].languageOptions.parserOptions,
                tsconfigRootDir: __dirname,
            },
        },
    }
];