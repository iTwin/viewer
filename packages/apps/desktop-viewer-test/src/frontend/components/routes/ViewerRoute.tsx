/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "@itwin/desktop-viewer-react";
import { MeasureToolsUiItemsProvider } from "@itwin/measure-tools-react";
import { PropertyGridUiItemsProvider } from "@itwin/property-grid-react";
import { TreeWidgetUiItemsProvider } from "@itwin/tree-widget-react";
import type { RouteComponentProps } from "@reach/router";
import React, { useEffect, useState } from "react";

import { IModelMergeItemsProvider } from "../../extensions";

interface ViewerRouteProps extends RouteComponentProps {
  children?: any;
}

export interface ViewerRouteState {
  filePath?: string;
}

export const ViewerRoute = ({ location }: ViewerRouteProps) => {
  const [filePath, setFilePath] = useState<string>();

  useEffect(() => {
    const routeState = location?.state as ViewerRouteState | undefined;
    if (routeState?.filePath) {
      setFilePath(routeState?.filePath);
    }
  }, [location?.state]);

  return filePath ? (
    <Viewer
      filePath={filePath}
      uiProviders={[
        new ViewerNavigationToolsProvider(),
        new ViewerContentToolsProvider({
          vertical: {
            measureGroup: false,
          },
        }),
        new ViewerStatusbarItemsProvider(),
        new TreeWidgetUiItemsProvider(),
        new PropertyGridUiItemsProvider({
          enableCopyingPropertyText: true,
        }),
        new MeasureToolsUiItemsProvider(),
        new IModelMergeItemsProvider(),
      ]}
      enablePerformanceMonitors={true}
    />
  ) : null;
};
