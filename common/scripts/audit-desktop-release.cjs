const { spawnSync } = require("node:child_process");
const { join } = require("node:path");

const audit = spawnSync(
  process.execPath,
  [join(__dirname, "install-run-rush-pnpm.js"), "audit", "--audit-level", "high", "--json"],
  {
    encoding: "utf8",
    env: { ...process.env, RUSH_QUIET_MODE: "1" },
  },
);

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function checkAudit() {
  if (audit.error) throw audit.error;
  if (audit.signal || (audit.status !== 0 && audit.status !== 1) || audit.stderr)
    throw new Error("pnpm audit did not complete cleanly.");

  const report = JSON.parse(audit.stdout);
  const metadata = report?.metadata;
  const counts = metadata?.vulnerabilities;
  const severities = ["info", "low", "moderate", "high", "critical"];
  if (
    !isRecord(report?.advisories) ||
    !isRecord(counts) ||
    !Number.isSafeInteger(metadata.totalDependencies) ||
    metadata.totalDependencies < 1 ||
    Object.hasOwn(report, "error") ||
    !Array.isArray(report.actions) ||
    !Array.isArray(report.muted) ||
    report.muted.length !== 0 ||
    !severities.every((level) => Number.isSafeInteger(counts[level]) && counts[level] >= 0)
  ) {
    throw new Error("Unexpected pnpm audit report.");
  }

  // At audit level high, pnpm only includes high and critical advisories in the map.
  const advisories = Object.values(report.advisories);
  if (
    advisories.length !== counts.high + counts.critical ||
    audit.status !== Number(advisories.length > 0)
  ) {
    throw new Error("The audit status does not match the report.");
  }

  console.log(`pnpm audit: ${severities.map((level) => `${counts[level]} ${level}`).join(", ")}`);
  if (advisories.length === 0) return;

  const [advisory] = advisories;
  const finding = advisory?.findings?.[0];
  // Remove this exception after Desktop Viewer 5.2.0 lets the template use Electron 42.
  if (
    counts.high !== 1 ||
    counts.critical !== 0 ||
    advisory?.severity !== "high" ||
    advisory.github_advisory_id !== "GHSA-jr5w-w6x2-84p9" ||
    advisory.module_name !== "electron" ||
    !Array.isArray(advisory.findings) ||
    advisory.findings.length !== 1 ||
    finding?.version !== "41.10.7" ||
    !Array.isArray(finding.paths) ||
    finding.paths.length !== 1 ||
    finding.paths[0] !== "..__..__packages__templates__desktop>electron"
  ) {
    throw new Error("The audit found a high or critical advisory outside the release exception.");
  }

  console.log("Release exception: GHSA-jr5w-w6x2-84p9 in itwin-desktop-viewer-template > electron@41.10.7");
}

try {
  checkAudit();
} catch (error) {
  if (audit.stdout) process.stdout.write(audit.stdout);
  if (audit.stderr) process.stderr.write(audit.stderr);
  console.error(error.message);
  process.exitCode = 1;
}
