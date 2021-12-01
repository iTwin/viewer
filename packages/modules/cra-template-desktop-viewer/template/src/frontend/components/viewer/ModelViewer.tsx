/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  FitViewTool,
  IModelApp,
  ScreenViewport,
  StandardViewId,
} from "@itwin/core-frontend";
import { Viewer } from "@itwin/desktop-viewer-react";
import React, { useCallback, useMemo } from "react";

interface ModelViewerParams {
  iTwinId?: string;
  iModelId?: string;
  snapshotPath?: string;
}

export const ModelViewer = ({
  iTwinId,
  iModelId,
  snapshotPath,
}: ModelViewerParams) => {
  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    (window as any).ITWIN_VIEWER_HOME = window.location.origin;

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
      void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  }, []);

  const onIModelAppInitialized = useMemo(() => {
    console.log("Initialized!!");
  }, []);

  return (
    <Viewer
      iTwinId={iTwinId}
      iModelId={iModelId}
      snapshotPath={snapshotPath}
      onIModelAppInit={onIModelAppInitialized as any}
      viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
      defaultUiConfig={{
        contentManipulationTools: { cornerItem: { hideDefault: true } },
      }}
    />
  );
};
