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

enum ViewerType {
  ONLINE,
  OFFLINE,
  SNAPSHOT,
}

interface ViewerRouteParams {
  type: ViewerType;
  id: string;
  projectId?: string;
  snapshotPath?: string;
  iModelId?: string;
}

// TODO Kevin cleanup
export const ViewerRoute = ({
  type,
  id,
  projectId,
  snapshotPath,
  iModelId,
}: RouteComponentProps<ViewerRouteParams>) => {
  // const [iModelId, setIModelId] = useState<string>();

  // useEffect(() => {
  //   switch (type) {
  //     case ViewerType.ONLINE:
  //       setIModelId(id);
  //       break;
  //   }
  // }, [type, id]);

  const viewConfiguration = (viewPort: ScreenViewport) => {
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
  };

  const onIModelAppInitialized = useMemo(() => {
    console.log("initialized!!");
  }, []);

  // function onIModelAppInitialized() {
  //   console.log("initialized!!");
  // }

  return (
    <Viewer
      contextId={projectId}
      iModelId={iModelId}
      snapshotPath={snapshotPath}
      onIModelAppInit={onIModelAppInitialized as any}
      // frontstages={frontstages}
      // backstageItems={backstageItems}
      viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
      defaultUiConfig={{
        contentManipulationTools: { cornerItem: { hideDefault: true } },
      }}
      // theme={} //TODO
    />
  );
};
