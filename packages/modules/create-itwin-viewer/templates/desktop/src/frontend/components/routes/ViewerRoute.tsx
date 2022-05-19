/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Viewer } from "@itwin/desktop-viewer-react";
import type { RouteComponentProps } from "@reach/router";
import React, { useEffect, useState } from "react";

import { uiConfig } from "../../../config";
import extensions from "../../../extensions";
import { IModelMergeItemsProvider } from "../../extensions/IModelMergeStatusBarItem";

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

  const uiProviders = extensions.map((extension) => extension.provider);
  uiProviders.push(new IModelMergeItemsProvider());

  return filePath ? (
    <Viewer
      filePath={filePath}
      uiProviders={uiProviders}
      enablePerformanceMonitors={true}
      defaultUiConfig={{ hideDefaultStatusBar: !uiConfig.statusBar }}
    />
  ) : null;
};
