/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StandardContentLayouts } from "@itwin/appui-abstract";
import {
  ContentGroup,
  ContentGroupProvider,
  FrontstageConfig,
  IModelViewportControl,
  UiFramework,
} from "@itwin/appui-react";

import { getAndSetViewState } from "../../../services/iModel";
import type {
  BlankConnectionViewState,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../../../types";

/**
 * Provide a default content group to the default frontstage
 */
export class DefaultContentGroupProvider extends ContentGroupProvider {
  contentGroup(_config: FrontstageConfig): Promise<ContentGroup> {
    throw new Error("Method not implemented.");
  }
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

  public async provideContentGroup(): Promise<ContentGroup> {
    const iModelConnection = UiFramework.getIModelConnection();
    let viewState;
    if (iModelConnection) {
      viewState = await getAndSetViewState(
        iModelConnection,
        this._viewportOptions,
        this._viewCreatorOptions,
        this._blankConnectionViewState
      );
    }
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
