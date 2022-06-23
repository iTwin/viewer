/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StandardNavigationToolsProvider } from "@itwin/web-viewer-itwin-react";

import { Viewer } from "../../../apps/cdn-viewer/node_modules/@itwin/web-viewer-react/lib/esm";
import { ViewerNavigationToolsProvider } from "../../web-viewer-react/node_modules/@itwin/viewer-react/src";
import type { ViewerExtensionProvider } from "./config";

export default [
  {
    provider: new StandardNavigationToolsProvider(),
  },
] as ViewerExtensionProvider[];
