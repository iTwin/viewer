/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { StandardContentLayouts } from "@itwin/appui-abstract";
import {
  ContentGroup,
  ContentGroupProvider,
  IModelViewportControl,
  UiFramework,
} from "@itwin/appui-react";
import type { IModelConnection, ViewState } from "@itwin/core-frontend";
import { ViewCreator3d } from "@itwin/core-frontend";

import { createBlankViewState } from "../../../services/iModel/ViewCreatorBlank";
import type {
  BlankConnectionViewState,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../../../types";

/**
 * Provide a default content group to the default frontstage
 */
export class DefaultContentGroupProvider extends ContentGroupProvider {
  private _viewportOptions: ViewerViewportControlOptions | undefined;
  private _blankConnectionViewState: BlankConnectionViewState | undefined;
  private _viewCreatorOptions: ViewerViewCreator3dOptions | undefined;

  constructor(
    viewportOptions?: ViewerViewportControlOptions,
    viewCreatorOptions?: ViewerViewCreator3dOptions,
    blankConnectionViewStateOptions?: BlankConnectionViewState
  ) {
    super();
    this._viewportOptions = viewportOptions;
    this._blankConnectionViewState = blankConnectionViewStateOptions;
    this._viewCreatorOptions = viewCreatorOptions;
  }

  async getViewState(
    connection: IModelConnection | undefined
  ): Promise<ViewState | undefined> {
    if (!connection || (!connection.isBlank && connection.isClosed)) {
      return;
    }
    let view: ViewState | undefined;
    if (this._viewportOptions?.viewState) {
      if (typeof this._viewportOptions?.viewState === "function") {
        view = await this._viewportOptions?.viewState(connection);
      } else {
        view = this._viewportOptions?.viewState;
      }
    }
    if (
      !this._viewportOptions?.alwaysUseSuppliedViewState &&
      (!view ||
        (view.iModel.iModelId !== connection.iModelId && connection.isOpen))
    ) {
      if (connection.isBlankConnection()) {
        view = createBlankViewState(connection, this._blankConnectionViewState);
      } else {
        // attempt to construct a default viewState
        const viewCreator = new ViewCreator3d(connection);

        const options: ViewerViewCreator3dOptions = this._viewCreatorOptions
          ? { ...this._viewCreatorOptions }
          : { useSeedView: true };

        if (options.useSeedView === undefined) {
          options.useSeedView = true;
        }

        view = await viewCreator.createDefaultView(options);
        UiFramework.setActiveSelectionScope("top-assembly");
      }

      // Should not be undefined
      if (!view) {
        throw new Error("No default view state for the imodel!");
      }
      // Set default view state
      UiFramework.setDefaultViewState(view);
    }
    return view;
  }

  public async provideContentGroup(): Promise<ContentGroup> {
    const iModelConnection = UiFramework.getIModelConnection();
    const viewState = await this.getViewState(iModelConnection);
    return new ContentGroup({
      id: "content-group",
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "viewport",
          classId: IModelViewportControl,
          applicationData: {
            ...this._viewportOptions,
            viewState,
            iModelConnection,
          },
        },
      ],
    });
  }
}
