/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { UiItemsProvider, Widget } from "@itwin/appui-react";
import { StagePanelLocation, WidgetState } from "@itwin/appui-react";
import { useActiveViewport } from "@itwin/appui-react";
import { Button } from "@itwin/itwinui-react";
import React, { useEffect } from "react";

const ViewportOnlyWidget: React.FunctionComponent<{
  onSampleIModelChange: (iModelId: string) => void;
}> = (props: { onSampleIModelChange: (iModelId: string) => void }) => {
  const viewport = useActiveViewport();

  /** Load the images on widget startup */
  useEffect(() => {
    if (viewport?.iModel.iModelId) {
      // eslint-disable-next-line no-console
      console.log(
        `Setting up sample widget with iModelId: ${viewport.iModel.iModelId}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport]);

  const toggleModel = () => {
    const iModelId1 = process.env.IMJS_AUTH_CLIENT_IMODEL_ID;
    const iModelId2 = process.env.IMJS_AUTH_CLIENT_IMODEL_ID2;
    let iModelId = iModelId1;
    if (!iModelId || viewport?.iModel.iModelId === iModelId1) {
      iModelId = iModelId2;
    }
    if (iModelId) {
      props.onSampleIModelChange(iModelId);
    }
  };

  // Display drawing and sheet options in separate sections.
  return (
    <div className="sample-options">
      <Button onClick={toggleModel}>Switch iModel</Button>
    </div>
  );
};

export class ViewportWidgetProvider implements UiItemsProvider {
  public readonly id: string = "ViewportWidgetProvider";
  private _onSampleiModelInfoChange: (iModelId: string) => void;
  constructor(onSampleiModelInfoChange: (iModelId: string) => void) {
    this._onSampleiModelInfoChange = onSampleiModelInfoChange;
  }

  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "ViewportWidgetProvider",
        label: "Viewport Widget Selector",
        defaultState: WidgetState.Floating,
        content: (
          <ViewportOnlyWidget
            onSampleIModelChange={this._onSampleiModelInfoChange}
          />
        ),
      });
    }
    return widgets;
  }
}
