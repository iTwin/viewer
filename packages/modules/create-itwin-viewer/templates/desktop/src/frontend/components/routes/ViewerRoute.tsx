/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Viewer } from "@itwin/desktop-viewer-react";
import type { RouteComponentProps } from "@reach/router";
import React, { useCallback, useEffect, useState } from "react";

import type { ViewerExtensionProvider } from "../../../config";
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

  const onIModelAppInitialized = useCallback(async () => {
    const initFns = extensions.map((extension: ViewerExtensionProvider) => {
      if (extension.initFn) {
        return extension.initFn();
      }
    });
    return await Promise.all(initFns);
  }, []);

  const uiProviders = extensions.map((extension) => extension.provider);
  uiProviders.push(new IModelMergeItemsProvider());

  return filePath ? (
    <Viewer
      filePath={filePath}
      onIModelAppInit={onIModelAppInitialized}
      uiProviders={uiProviders}
      enablePerformanceMonitors={true}
      defaultUiConfig={{ hideDefaultStatusBar: !uiConfig.statusBar }}
    />
  ) : null;
};
