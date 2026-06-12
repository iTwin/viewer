/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as fs from "fs";
import * as path from "path";
import { describe, expect, it } from "vitest";

// The repository root README.MD contains degit commands. On Linux (case-sensitive
// file systems) the GitHub API requires the org/repo portion to be lowercase.
// Using "iTwin/viewer" instead of "itwin/viewer" causes degit to copy the entire
// repo rather than the specified sub-folder.  See: https://github.com/iTwin/viewer/issues/428
describe("README degit commands", () => {
  // When vitest runs from the package directory, process.cwd() is the package root.
  // Navigate three levels up (viewer-react -> modules -> packages -> repo root).
  const repoRoot = path.resolve(process.cwd(), "../../..");
  const readmePath = path.join(repoRoot, "README.MD");

  it("should use lowercase org/repo in degit commands", () => {
    const content = fs.readFileSync(readmePath, "utf-8");

    // Extract lines containing actual degit invocations (e.g. "npx degit ..." or "degit ...")
    // Exclude table/prose lines that merely mention the word "degit".
    const degitLines = content
      .split("\n")
      .filter((line) => /degit\s+\S+\/\S+/.test(line));

    expect(degitLines.length).toBeGreaterThan(0);

    for (const line of degitLines) {
      // The org/repo portion must be lowercase "itwin/viewer".
      // Using "iTwin/viewer" (mixed case) fails on Linux case-sensitive file systems.
      expect(
        line,
        `Degit command must use lowercase "itwin/viewer", got: ${line.trim()}`
      ).not.toMatch(/degit\s+iTwin\/viewer/);

      expect(
        line,
        `Degit command must use lowercase "itwin/viewer", got: ${line.trim()}`
      ).toMatch(/degit\s+itwin\/viewer/);
    }
  });
});
