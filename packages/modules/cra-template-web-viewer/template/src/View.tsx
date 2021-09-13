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
import React, { useState } from "react";

import AuthorizationOptions from "./AuthorizationOptions";

const View: React.FC = () => {
  // Convert process var to window var
  const [iModelId] = useState(sessionStorage.getItem("IMJS_IMODEL_ID"));
  const [contextId] = useState(sessionStorage.getItem("IMJS_CONTEXT_ID"));

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
    <>
      {contextId && iModelId && (
        <Viewer
          contextId={contextId}
          iModelId={iModelId}
          authConfig={AuthorizationOptions}
          viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
        />
      )}
    </>
  );
};

export default View;
