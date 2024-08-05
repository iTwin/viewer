/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  IModelConnectedViewport,
  IModelViewportControl,
  UiFramework,
} from "@itwin/appui-react";
import type { IModelConnection, ScreenViewport } from "@itwin/core-frontend";
import type { ViewStateProp } from "@itwin/imodel-components-react";
import { ViewportComponent } from "@itwin/imodel-components-react";
import { viewWithUnifiedSelection } from "@itwin/presentation-components";
import * as React from "react";

const UnifiedSelectionViewport = viewWithUnifiedSelection(ViewportComponent);

/** @internal fork of IModelViewportControl from AppUI, to provide Unified Selection
 * https://github.com/iTwin/appui/blob/master/ui/appui-react/src/appui-react/content/IModelViewport.tsx
 */
export class UnifiedSelectionViewportControl extends IModelViewportControl {
  public static override get id() {
    return "iTwinViewer.UnifiedSelectionViewportControl";
  }

  /** Get the React component that will contain the Viewport */
  protected override getImodelConnectedViewportReactElement(): React.ReactNode {
    return (
      <IModelConnectedViewport
        viewportRef={(v: ScreenViewport) => {
          this.viewport = v;
          // for convenience, if window defined bind viewport to window
          if (undefined !== window) {
            (window as any).viewport = v;
          }
          if (!UiFramework.frontstages.isLoading) {
            UiFramework.frontstages.activeFrontstageDef?.setActiveViewFromViewport(
              v
            );
          }
        }}
        getViewOverlay={this._getViewOverlay}
      />
    );
  }

  protected override getImodelViewportReactElement(
    iModelConnection: IModelConnection,
    viewState: ViewStateProp
  ): React.ReactNode {
    return (
      <UnifiedSelectionViewport
        viewState={viewState}
        imodel={iModelConnection}
        controlId={this.controlId}
        viewportRef={(v: ScreenViewport) => {
          this.viewport = v;
          // for convenience, if window defined bind viewport to window
          if (undefined !== window) {
            (window as any).viewport = v;
          }
          if (!UiFramework.frontstages.isLoading) {
            UiFramework.frontstages.activeFrontstageDef?.setActiveViewFromViewport(
              v
            );
          }
        }}
        getViewOverlay={this._getViewOverlay}
      />
    );
  }
}
