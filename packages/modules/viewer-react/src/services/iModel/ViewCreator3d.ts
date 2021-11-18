/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/*
API for creating a 3D default view for an iModel.
Either takes in a list of modelIds, or displays all 3D models by default.
*/

import { Id64 } from "@itwin/core-bentley";
import {
  FitViewTool,
  IModelApp,
  ScreenViewport,
  StandardViewId,
  ViewCreator3d as ViewCreator,
  ViewState,
} from "@itwin/core-frontend";

import { ViewCreator3dOptions } from "../../types";

/**
 * API for creating a 3D default [[ViewState3d]] for an iModel. @see [[ViewCreator2d]] to create a view for a 2d model.
 * Example usage:
 * ```ts
 * const viewCreator = new ViewCreator3d(imodel);
 * const defaultView = await viewCreator.createDefaultView({skyboxOn: true});
 * ```
 * @public
 */
export class ViewCreator3d extends ViewCreator {
  /**
   * Creates a default [[ViewState3d]] based on the model ids passed in. If no model ids are passed in, all 3D models in the iModel are used.
   * @param [options] Options for creating the view.
   * @param [modelIds] Ids of models to display in the view.
   * @throws [IModelError]($common) If no 3d models are found in the iModel.
   */
  public override async createDefaultView(
    options?: ViewCreator3dOptions,
    modelIds?: string[]
  ): Promise<ViewState> {
    const viewState = await super.createDefaultView(options, modelIds);

    if (viewState.iModel.isOpen) {
      // configure the view
      IModelApp.viewManager.onViewOpen.addOnce((viewPort: ScreenViewport) => {
        if (viewState.iModel.isOpen) {
          // Always start with the standard rotation to ISO, it can be adjusted using any of the other methods after.
          void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
          viewPort.view.setStandardRotation(StandardViewId.Iso);

          // check for a custom configurer and execute
          if (options?.viewportConfigurer) {
            options.viewportConfigurer(viewPort);
            return;
          }

          // failing that, if there is a valid default view id, adjust the volume but otherwise retain the view as is
          if (Id64.isValidId64(viewState.id)) {
            if (options?.standardViewId) {
              viewState.setStandardRotation(options.standardViewId);
            }
            const range = viewState.computeFitRange();
            viewState.lookAtVolume(range, options?.vpAspect);
            return;
          }

          // no default view and no custom configurer
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
            viewPort.view.setStandardRotation(
              options?.standardViewId ?? StandardViewId.Iso
            );
          });
        }
      });
    }

    return viewState;
  }
}
