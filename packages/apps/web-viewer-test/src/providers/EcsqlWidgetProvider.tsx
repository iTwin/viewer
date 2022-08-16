/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  AbstractWidgetProps,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import {
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
} from "@itwin/appui-abstract";
import React from "react";

import EcsqlWidget from "./EcsqlWidget";

export class EcsqlWidgetProvider implements UiItemsProvider {
  public readonly id = "EcsqlWidgetProvider";

  public provideWidgets(
    stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];

    if (
      stageId === "DefaultFrontstage" &&
      stageUsage === StageUsage.General &&
      location === StagePanelLocation.Bottom &&
      section === StagePanelSection.Start
    ) {
      const ecsqlWidget: AbstractWidgetProps = {
        id: "EcsqlWidget",
        label: "ECSQL",
        getWidgetContent() {
          return <EcsqlWidget />;
        },
      };
      widgets.push(ecsqlWidget);
    }

    return widgets;
  }
}
