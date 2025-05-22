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

import { getAndSetViewState } from "../../../services/iModel";
import type {
  BlankConnectionViewState,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../../../types";
import { UnifiedSelectionViewportControl } from "./UnifiedSelectionViewportControl";

/**
 * Provide a default content group to the default frontstage
 */
export class DefaultContentGroupProvider extends ContentGroupProvider {
  private _viewportOptions: ViewerViewportControlOptions | undefined;
  private _blankConnectionViewState: BlankConnectionViewState | undefined;
  private _viewCreatorOptions: ViewerViewCreator3dOptions | undefined;
  private _isUsingDeprecatedSelectionManager: boolean | undefined;

  constructor(
    viewportOptions?: ViewerViewportControlOptions,
    viewCreatorOptions?: ViewerViewCreator3dOptions,
    blankConnectionViewStateOptions?: BlankConnectionViewState,
    isUsingDeprecatedSelectionManager?: boolean,
  ) {
    super();
    this._viewportOptions = viewportOptions;
    this._blankConnectionViewState = blankConnectionViewStateOptions;
    this._viewCreatorOptions = viewCreatorOptions;
    this._isUsingDeprecatedSelectionManager = isUsingDeprecatedSelectionManager;
  }

  public async contentGroup(): Promise<ContentGroup> {
    const iModelConnection = UiFramework.getIModelConnection();
    if (!iModelConnection) {
      throw "Never expected to get here without an iModelConnection";
    }

    const viewState = await getAndSetViewState(
      iModelConnection,
      this._viewportOptions,
      this._viewCreatorOptions,
      this._blankConnectionViewState
    );

    return new ContentGroup({
      id: "iTwinViewer.default-content-group",
      layout: StandardContentLayouts.singleView, // eslint-disable-line @typescript-eslint/no-deprecated
      contents: [
        {
          id: "iTwinViewer.UnifiedSelectionViewport",
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          classId: this._isUsingDeprecatedSelectionManager ? UnifiedSelectionViewportControl : IModelViewportControl,
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
