/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { registerTool } from "@itwin/core-extension";

import { ExtensionTool } from "./ExtensionTool";

export default () => {
  console.log("remote extension loaded");
  void registerTool(ExtensionTool);
};
