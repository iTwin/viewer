/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import type { UiItemsProvider, Widget } from "@itwin/appui-react";
import { StagePanelLocation } from "@itwin/appui-react";
import { Flex } from "@itwin/itwinui-react";

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
        content: <Flex justifyContent="center" style={{ height: "100%" }}>Addon Widget in panel</Flex>,
      });
    }
    return widgets;
  }
}
