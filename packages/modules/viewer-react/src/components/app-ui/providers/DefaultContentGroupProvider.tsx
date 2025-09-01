/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import {
  ContentGroup,
  ContentGroupProvider,
  StandardContentLayouts,
  UiFramework,
} from "@itwin/appui-react";
import type { ScreenViewport } from "@itwin/core-frontend";
import { ViewportComponent } from "@itwin/imodel-components-react";
import { viewWithUnifiedSelection } from "@itwin/presentation-components";
import React from "react";

import { getAndSetViewState } from "../../../services/iModel/index.js";
import type {
  BlankConnectionViewState,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../../../types.js";

const UnifiedSelectionViewport = viewWithUnifiedSelection(ViewportComponent); // eslint-disable-line @typescript-eslint/no-deprecated

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
    isUsingDeprecatedSelectionManager?: boolean
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
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: this._isUsingDeprecatedSelectionManager
            ? "iTwinViewer.UnifiedSelectionViewport"
            : "iTwinViewer.Viewport",
          classId: "",
          content: (
            <ViewportWithOverlay
              viewState={viewState}
              imodel={iModelConnection}
              deprecatedSelectionManager={
                this._isUsingDeprecatedSelectionManager
              }
              supplyViewOverlay={this._viewportOptions?.supplyViewOverlay}
            />
          ),
        },
      ],
    });
  }
}

type ViewportComponentProps = React.ComponentProps<typeof ViewportComponent>;

interface ViewportWithOverlayProps
  extends Pick<ViewportComponentProps, "viewState" | "imodel">,
    Pick<ViewerViewportControlOptions, "supplyViewOverlay"> {
  deprecatedSelectionManager?: boolean;
}

function ViewportWithOverlay(props: ViewportWithOverlayProps) {
  const { supplyViewOverlay } = props;

  const [viewport, setViewport] = React.useState<ScreenViewport | undefined>(
    undefined
  );
  const viewOverlay = React.useMemo(() => {
    if (!viewport || !supplyViewOverlay) {return null;}
    return supplyViewOverlay(viewport);
  }, [viewport, supplyViewOverlay]);
  return (
    <>
      {props.deprecatedSelectionManager ? (
        <UnifiedSelectionViewport
          viewState={props.viewState}
          imodel={props.imodel}
          controlId={"iTwinViewer.UnifiedSelectionViewportControl"}
          viewportRef={setViewport}
        />
      ) : (
        <ViewportComponent
          viewState={props.viewState}
          imodel={props.imodel}
          controlId={"iTwinViewer.ViewportControl"}
          viewportRef={setViewport}
        />
      )}
      {viewOverlay}
    </>
  );
}
