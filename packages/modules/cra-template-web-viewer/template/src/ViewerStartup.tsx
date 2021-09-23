/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./App.scss";

import {
  FitViewTool,
  IModelApp,
  ScreenViewport,
  StandardViewId,
} from "@bentley/imodeljs-frontend";
import { Viewer } from "@itwin/web-viewer-react";
import React, { useContext } from "react";

import IModelJsContext from "./ViewerContext";

const ViewerStartup: React.FC = () => {
  // Convert process var to window var
  const context = useContext(IModelJsContext);

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = (viewPort: ScreenViewport) => {
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

  return (
    <Viewer
      contextId={context.contextId}
      iModelId={context.iModelId}
      authConfig={context.authOptions}
      viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
    />
  );
};

export default ViewerStartup;
