/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Viewer } from "../../../../apps/cdn-viewer/node_modules/@itwin/desktop-viewer-react/lib/esm";
import { ViewerNavigationToolsProvider } from "../../../desktop-viewer-react/node_modules/@itwin/desktop-viewer-react/src";
import { StandardNavigationToolsProvider } from "../../../web-viewer-react/node_modules/@itwin/desktop-viewer-react/src";
import type { ViewerExtensionProvider } from "./config";

export default [
  {
    provider: new StandardNavigationToolsProvider(),
  },
] as ViewerExtensionProvider[];
