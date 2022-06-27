/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StandardNavigationToolsProvider } from "@itwin/desktop-viewer-react";
import {
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "@itwin/desktop-viewer-react";

import type { ViewerExtensionProvider } from "./config";

export default [
  {
    provider: new StandardNavigationToolsProvider(),
  },
  {
    provider: new ViewerNavigationToolsProvider(),
  },
  {
    provider: new ViewerContentToolsProvider(),
  },
  {
    provider: new ViewerStatusbarItemsProvider(),
  },
] as ViewerExtensionProvider[];
