const path = require("path");

module.exports = {
  reactScriptsVersion: "@bentley/react-scripts",

  babel: {
    plugins: [
      "@babel/plugin-proposal-explicit-resource-management"
    ],
  },

  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find((rule) => Array.isArray(rule.oneOf));
      if (oneOfRule) {
        oneOfRule.oneOf.forEach((rule) => {
          if (
            rule.loader &&
            rule.loader.includes("babel-loader") &&
            rule.include
          ) {
            rule.include = [
              ...(Array.isArray(rule.include) ? rule.include : [rule.include]),
              path.resolve("node_modules/@itwin/presentation-frontend"),
            ];
          }
        });
      }

      return webpackConfig;
    }
  }
};
