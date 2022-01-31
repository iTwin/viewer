/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  AbstractWidgetProps,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { StagePanelLocation, WidgetState } from "@itwin/appui-abstract";
import { useActiveViewport } from "@itwin/appui-react";
import { Button } from "@itwin/itwinui-react";
import React, { useEffect } from "react";

const ViewportOnlyWidget: React.FunctionComponent<{
  onSampleIModelChange: (iModelId: string, iTwinId: string) => void;
}> = (props: {
  onSampleIModelChange: (iModelId: string, iTwinId: string) => void;
}) => {
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
    props.onSampleIModelChange(
      "435e704b-ae19-418c-a02e-fc75686e213c",
      "1bff8c44-3196-4231-b8f6-66cf6dacd45b"
    );
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
  private _onSampleiModelInfoChange: (
    iModelId: string,
    iTwinId: string
  ) => void;
  constructor(
    onSampleiModelInfoChange: (iModelId: string, iTwinId: string) => void
  ) {
    this._onSampleiModelInfoChange = onSampleiModelInfoChange;
  }

  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "ViewportWidgetProvider",
        label: "Viewport Widget Selector",
        defaultState: WidgetState.Floating,
        // eslint-disable-next-line react/display-name
        getWidgetContent: () => (
          <ViewportOnlyWidget
            onSampleIModelChange={this._onSampleiModelInfoChange}
          />
        ),
      });
    }
    return widgets;
  }
}
