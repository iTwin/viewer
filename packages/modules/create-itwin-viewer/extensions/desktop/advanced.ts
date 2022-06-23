/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StandardNavigationToolsProvider } from "@itwin/desktop-viewer-itwin-react";
import {
  PropertyGridManager,
  PropertyGridUiItemsProvider,
} from "@itwin/property-grid-react";
import {
  TreeWidget,
  TreeWidgetUiItemsProvider,
} from "@itwin/tree-widget-react";

import {
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "../../../web-viewer-react/node_modules/@itwin/viewer-react/src";
import type { ViewerExtensionProvider } from "./config";

export default [
  {
    provider: new StandardNavigationToolsProvider(),
  },
  {
    provider: new TreeWidgetUiItemsProvider(),
    initFn: async () => {
      await TreeWidget.initialize();
    },
  },
  {
    provider: new PropertyGridUiItemsProvider({
      enableCopyingPropertyText: true,
    }),
    initFn: async () => {
      await PropertyGridManager.initialize();
    },
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
