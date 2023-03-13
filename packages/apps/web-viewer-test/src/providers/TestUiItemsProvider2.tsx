/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { UiItemsProvider, Widget } from "@itwin/appui-react";
import { StagePanelLocation } from "@itwin/appui-react";
import { FillCentered } from "@itwin/core-react";
import React from "react";

export class TestUiProvider2 implements UiItemsProvider {
  public readonly id = "TestUiProvider2";

  public provideWidgets(
    stageId: string,
    _stageUsage: string,
    location: StagePanelLocation
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (
      stageId === "DefaultFrontstage" &&
      location === StagePanelLocation.Right
    ) {
      widgets.push({
        id: "addonWidget",
        content: () => <FillCentered>Addon Widget in panel</FillCentered>,
      });
    }
    return widgets;
  }
}
