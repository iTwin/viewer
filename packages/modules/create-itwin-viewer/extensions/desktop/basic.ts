/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Viewer } from "@itwin/desktop-viewer-react";
import { ViewerNavigationToolsProvider } from "@itwin/desktop-viewer-react";
import { StandardNavigationToolsProvider } from "@itwin/desktop-viewer-react";

import type { ViewerExtensionProvider } from "./config";

export default [
  {
    provider: new StandardNavigationToolsProvider(),
  },
] as ViewerExtensionProvider[];
