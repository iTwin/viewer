/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Viewer } from "../../../apps/cdn-viewer/node_modules/@itwin/web-viewer-react/lib/esm";
import { StandardNavigationToolsProvider } from "../../web-viewer-react/node_modules/@itwin/web-viewer-react/src";
import { ViewerNavigationToolsProvider } from "../../web-viewer-react/node_modules/@itwin/web-viewer-react/src";
import type { ViewerExtensionProvider } from "./config";

export default [
  {
    provider: new StandardNavigationToolsProvider(),
  },
] as ViewerExtensionProvider[];
