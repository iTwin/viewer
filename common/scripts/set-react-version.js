// Pins the monorepo to React 18 so that CI can check React 18 support.
// The published modules develop against React 19 and allow React 18 as a peer.
//
// Usage:
//   node common/scripts/set-react-version.js apply
//     Adds React 18 pnpm overrides to common/config/rush/pnpm-config.json.
//     Run "rush update" after this. Do not commit the result.
//   node common/scripts/set-react-version.js verify
//     Fails unless each published module resolves React 18.

const fs = require("fs");
const path = require("path");

const REACT_VERSION = "18.3.1";

const overrides = {
  react: REACT_VERSION,
  "react-dom": REACT_VERSION,
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
};

const repoRoot = path.resolve(__dirname, "..", "..");
const pnpmConfigPath = path.join(
  repoRoot,
  "common",
  "config",
  "rush",
  "pnpm-config.json"
);
const moduleFolders = [
  "packages/modules/viewer-react",
  "packages/modules/web-viewer-react",
  "packages/modules/desktop-viewer-react",
];

function apply() {
  const config = JSON.parse(fs.readFileSync(pnpmConfigPath, "utf8"));
  config.globalOverrides = { ...config.globalOverrides, ...overrides };
  fs.writeFileSync(pnpmConfigPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`Added React ${REACT_VERSION} overrides to ${pnpmConfigPath}`);
}

function verify() {
  let hasMismatch = false;
  for (const folder of moduleFolders) {
    const moduleRoot = path.join(repoRoot, folder);
    for (const name of ["react", "react-dom"]) {
      const manifestPath = require.resolve(`${name}/package.json`, {
        paths: [moduleRoot],
      });
      const { version } = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      console.log(`${folder}: ${name}@${version}`);
      if (version !== REACT_VERSION) {
        hasMismatch = true;
      }
    }
  }
  if (hasMismatch) {
    console.error(`Expected ${REACT_VERSION} for every module.`);
    process.exit(1);
  }
}

const command = process.argv[2];
if (command === "apply") {
  apply();
} else if (command === "verify") {
  verify();
} else {
  console.error("Usage: node set-react-version.js <apply|verify>");
  process.exit(1);
}
