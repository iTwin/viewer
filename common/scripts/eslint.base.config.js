const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const prettier = require("eslint-plugin-prettier");
const simpleImportSortPlugin = require("eslint-plugin-simple-import-sort");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
    {   
        files: ["**/*.{ts,tsx}"],
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
            prettier,
            react,
            "simple-import-sort": simpleImportSortPlugin,
            "react-hooks": reactHooks,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...react.configs.recommended.rules,
            "no-console": "off",
            "import/prefer-default-export": "off",
            radix: "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-member-accessibility": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/interface-name-prefix": "off",
            "react/no-unescaped-entities": "off",
            "react/display-name": "off",
            "react/prop-types": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
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
    }
];  