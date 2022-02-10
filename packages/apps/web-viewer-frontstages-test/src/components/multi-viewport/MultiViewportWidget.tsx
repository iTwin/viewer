/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./MultiViewport.scss";

import type {
  AbstractWidgetProps,
  StagePanelSection,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { StagePanelLocation, WidgetState } from "@itwin/appui-abstract";
import { useActiveViewport } from "@itwin/appui-react";
import type { Viewport } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { ToggleSwitch } from "@itwin/itwinui-react";
import React, { useEffect } from "react";

import MultiViewportApi from "./MultiViewportApi";

const MultiViewportWidget: React.FunctionComponent = () => {
  const viewport = useActiveViewport();
  const [isSynched, setIsSynched] = React.useState<boolean>();

  // Handle changes to the UI sync toggle.
  useEffect(() => {
    if (isSynched && viewport !== undefined) {
      let selectedViewport: Viewport | undefined,
        unselectedViewport: Viewport | undefined;
      for (const vp of IModelApp.viewManager) {
        if (vp.viewportId === viewport.viewportId) {
          selectedViewport = vp;
        } else {
          unselectedViewport = vp;
        }
      }
      if (selectedViewport === undefined || unselectedViewport === undefined) {
        return;
      }
      // By passing the selected viewport as the first argument, this will be the view
      //  used to override the second argument's view.
      MultiViewportApi.connectViewports(selectedViewport, unselectedViewport);
    } else {
      MultiViewportApi.disconnectViewports();
    }
  }, [viewport, isSynched]);

  // Display drawing and sheet options in separate sections.
  return (
    <div className="sample-options">
      <div className="sample-options-2col">
        <span>Sync Viewports</span>
        <ToggleSwitch
          disabled={viewport === undefined}
          checked={isSynched}
          onChange={(e) => setIsSynched(e.target.checked)}
        />
      </div>
    </div>
  );
};

export class MultiViewportWidgetProvider implements UiItemsProvider {
  public readonly id: string = "MultiViewportWidgetProvider";

  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "MultiViewportWidget",
        label: "Multi Viewport Selector",
        defaultState: WidgetState.Floating,
        // eslint-disable-next-line react/display-name
        getWidgetContent: () => <MultiViewportWidget />,
      });
    }
    return widgets;
  }
}
