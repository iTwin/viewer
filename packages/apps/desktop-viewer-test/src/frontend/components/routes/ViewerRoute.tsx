/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Viewer } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React, { useEffect, useMemo, useState } from "react";

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

  const onIModelAppInitialized = useMemo(() => {
    console.log("iTwin.js Initialized!");
  }, []);

  return filePath ? (
    <Viewer
      snapshotPath={filePath}
      onIModelAppInit={onIModelAppInitialized as any}
      defaultUiConfig={{
        contentManipulationTools: { cornerItem: { hideDefault: true } },
      }}
      uiProviders={[new IModelMergeItemsProvider()]}
    />
  ) : null;
};
