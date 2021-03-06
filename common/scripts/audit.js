/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const {
  logBuildError,
  logBuildWarning,
  failBuild,
  throwAfterTimeout,
} = require("./utils");

const rushCommonDir = path.join(__dirname, "../");

(async () => {
  const commonTempDir = path.join(rushCommonDir, "config/rush");

  // Npm audit will occasionally take minutes to respond - we believe this is just the npm registry being terrible and slow.
  // We don't want this to slow down our builds though - we'd rather fail fast and try again later.  So we'll just timeout after 30 seconds.
  let jsonOut = {};
  try {
    console.time("Audit time");
    jsonOut = await Promise.race([
      runPnpmAuditAsync(commonTempDir),
      throwAfterTimeout(180000, "Timed out contacting npm registry."),
    ]);
    console.timeEnd("Audit time");
    console.log();
  } catch (error) {
    // We want to stop failing the build on transient failures and instead fail only on high/critical vulnerabilities.
    logBuildWarning(error);
    process.exit();
  }

  if (jsonOut.error) {
    console.error(jsonOut.error.summary);
    logBuildWarning(
      "Rush audit failed. This may be caused by a problem with the npm audit server."
    );
  }

  // A list of temporary advisories excluded from the High and Critical list.
  // Warning this should only be used as a temporary measure to avoid build failures
  // for development dependencies only.
  // All security issues should be addressed asap.
  const excludedAdvisories = [
    "GHSA-8p5q-j9m2-g8wr", // https://github.com/advisories/GHSA-8p5q-j9m2-g8wr.
    "GHSA-ww39-953v-wcq6", // https://github.com/advisories/GHSA-ww39-953v-wcq6.
    "GHSA-8v27-2fg9-7h62", // https://github.com/advisories/GHSA-8v27-2fg9-7h62.
    "GHSA-33f9-j839-rf8h", // https://github.com/advisories/GHSA-33f9-j839-rf8h.
    "GHSA-c36v-fmgq-m8hx", // https://github.com/advisories/GHSA-c36v-fmgq-m8hx.
    "GHSA-4jqc-8m5r-9rpr", // https://github.com/advisories/GHSA-4jqc-8m5r-9rpr.
    "GHSA-whgm-jr23-g3j9", // https://github.com/advisories/GHSA-whgm-jr23-g3j9.
    "GHSA-qq89-hq3f-393p", // https://github.com/advisories/GHSA-qq89-hq3f-393p.,
    "GHSA-5955-9wpr-37jh", // https://github.com/advisories/GHSA-5955-9wpr-37jh,
    "GHSA-r683-j2x4-v87g", // https://github.com/advisories/GHSA-r683-j2x4-v87g  /TODO Fix
    "GHSA-wpg7-2c88-r8xv", // https://github.com/advisories/GHSA-wpg7-2c88-r8xv,
    "GHSA-rqff-837h-mm52", // https://github.com/advisories/GHSA-rqff-837h-mm52,
    "GHSA-hgjh-723h-mx2j", // https://github.com/advisories/GHSA-hgjh-723h-mx2j,
    "GHSA-xvch-5gv4-984h", // https://github.com/advisories/GHSA-xvch-5gv4-984h,
    "GHSA-cfm4-qjh2-4765", // https://github.com/advisories/GHSA-cfm4-qjh2-4765,
    "GHSA-x4jg-mjrx-434g", // https://github.com/advisories/GHSA-x4jg-mjrx-434g,
    "GHSA-phwq-j96m-2c2q", // https://github.com/advisories/GHSA-phwq-j96m-2c2q // @bentley/react-scripts>workbox-webpack-plugin>workbox-build>@surma/rollup-plugin-off-main-thread>ejs
    "GHSA-93q8-gq69-wqmw", // https://github.com/advisories/GHSA-93q8-gq69-wqmw // @itwin/build-tools>mocha>wide-align>string-width>strip-ansi>ansi-regex
    "GHSA-fwr7-v2mv-hh25", // https://github.com/advisories/GHSA-fwr7-v2mv-hh25 // @bentley/react-scripts>fast-sass-loader>async
    "GHSA-rp65-9cf3-cjxr", // https://github.com/advisories/GHSA-rp65-9cf3-cjxr // @bentley/react-scripts>optimize-css-assets-webpack-plugin>cssnano>cssnano-preset-default>postcss-svgo>svgo>css-select>nth-check
    "GHSA-6h5x-7c5m-7cr7", // https://github.com/advisories/GHSA-6h5x-7c5m-7cr7 // @bentley/react-scripts>webpack-dev-server>sockjs-client>eventsource
    "GHSA-g4rg-993r-mgx7", // https://github.com/advisories/GHSA-g4rg-993r-mgx7 // @bentley/react-scripts>react-dev-utils>shell-quote
  ];

  let shouldFailBuild = false;
  for (const action of jsonOut.actions) {
    for (const issue of action.resolves) {
      const advisory = jsonOut.advisories[issue.id];

      const mpath = issue.path.replace("@rush-temp", "@bentley");

      const severity = advisory.severity.toUpperCase();
      const message = `${severity} Security Vulnerability: ${advisory.title} in ${advisory.module_name} (from ${mpath}).  See ${advisory.url} for more info.`;

      // For now, we'll only treat CRITICAL and HIGH vulnerabilities as errors in CI builds.
      if (
        !excludedAdvisories.includes(advisory.github_advisory_id) &&
        (severity === "HIGH" || severity === "CRITICAL")
      ) {
        logBuildError(message);
        shouldFailBuild = true;
      } else if (
        excludedAdvisories.includes(advisory.github_advisory_id) ||
        severity === "MODERATE"
      )
        // Only warn on MODERATE severity items
        // Only warn on MODERATE severity items
        logBuildWarning(message);
    }
  }

  // For some reason yarn audit can return the json without the vulnerabilities
  if (undefined === jsonOut.metadata.vulnerabilities || shouldFailBuild)
    failBuild();

  process.exit();
})();

function runPnpmAuditAsync(cwd) {
  return new Promise((resolve, reject) => {
    // pnpm audit requires a package.json file so we temporarily create one and
    // then delete it later
    fs.writeFileSync(
      path.join(rushCommonDir, "config/rush/package.json"),
      JSON.stringify("{}", null, 2)
    );

    console.log("Running audit");
    const pnpmPath = path.join(
      rushCommonDir,
      "temp/pnpm-local/node_modules/.bin/pnpm"
    );
    const child = spawn(pnpmPath, ["audit", "--json"], { cwd, shell: true });

    let stdout = "";
    child.stdout.on("data", (data) => {
      stdout += data;
    });

    child.on("error", (data) => {
      fs.unlinkSync(path.join(rushCommonDir, "config/rush/package.json"));
      reject(data);
    });
    child.on("close", () => {
      fs.unlinkSync(path.join(rushCommonDir, "config/rush/package.json"));
      resolve(JSON.parse(stdout.trim()));
    });
  });
}
