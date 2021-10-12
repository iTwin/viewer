/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  AbstractWidgetProps,
  StagePanelLocation,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { FillCentered } from "@itwin/core-react";
import React from "react";

export class TestUiProvider2 implements UiItemsProvider {
  public readonly id = "TestUiProvider2";

  public provideWidgets(
    stageId: string,
    _stageUsage: string,
    location: StagePanelLocation
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (
      stageId === "DefaultFrontstage" &&
      location === StagePanelLocation.Right
    ) {
      widgets.push({
        id: "addonWidget",
        getWidgetContent: () => (
          <FillCentered>Addon Widget in panel</FillCentered>
        ),
      });
    }
    return widgets;
  }
}
