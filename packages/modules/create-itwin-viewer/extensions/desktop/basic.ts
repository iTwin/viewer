/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ViewerNavigationToolsProvider } from "@itwin/desktop-viewer-react";

import type { ViewerExtensionProvider } from "./config";

export default [
  {
    provider: new ViewerNavigationToolsProvider(),
  },
] as ViewerExtensionProvider[];
