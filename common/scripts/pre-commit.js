const lintStaged = require("lint-staged");

async function preCommit() {
  const success = await lintStaged({
    config: {
      "*.{ts,tsx}": [
        "node ./common/scripts/copyright-linter.js --",
        "node --max_old_space_size=4096 ./common/scripts/node_modules/eslint/bin/eslint.js --config ./common/scripts/eslint.autofix.config.js --ignore-pattern **/node_modules/** --fix",
        "node ./common/scripts/node_modules/prettier --write --config ./.prettierrc --ignore-path ./.prettierignore",
        "node --max_old_space_size=4096 ./common/scripts/node_modules/eslint/bin/eslint.js --config ./common/scripts/eslint.autofix.config.js --ignore-pattern **/node_modules/** --color",
      ],
      "*.{md,json}": [
        "node ./common/scripts/node_modules/prettier --write --config ./.prettierrc --ignore-path ./.prettierignore",
      ],
      "*.{scss,css}": [
        "node ./common/scripts/copyright-linter.js --",
        "node ./common/scripts/node_modules/stylelint --fix --config ./.stylelintrc",
      ],
    },
    verbose: true,
  });

  if (!success) {
    process.exit(1);
  }
}

preCommit();
