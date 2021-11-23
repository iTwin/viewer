/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  FitViewTool,
  IModelApp,
  ScreenViewport,
  StandardViewId,
} from "@bentley/imodeljs-frontend";
import { Viewer } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface ViewerRouteProps extends RouteComponentProps {
  children?: any;
}

interface ViewerRouteState {
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

  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    // default execute the fitview tool and use the iso standard view after tile trees are loaded
    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          // after 20 seconds, stop waiting and fit the view
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };

    tileTreesLoaded().finally(() => {
      IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  }, []);

  const onIModelAppInitialized = useMemo(() => {
    console.log("Initialized!!");
  }, []);

  return filePath ? (
    <Viewer
      snapshotPath={filePath}
      onIModelAppInit={onIModelAppInitialized as any}
      viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
      defaultUiConfig={{
        contentManipulationTools: { cornerItem: { hideDefault: true } },
      }}
    />
  ) : null;
};
