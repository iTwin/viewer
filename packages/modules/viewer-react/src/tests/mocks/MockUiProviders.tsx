/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  ConditionalBooleanValue,
  ConditionalStringValue,
} from "@itwin/appui-abstract";
import type {
  StagePanelSection,
  StatusBarItem,
  ToolbarItem,
  UiItemsProvider,
  Widget,
} from "@itwin/appui-react";
import {
  StagePanelLocation,
  StageUsage,
  StatusBarItemUtilities,
  StatusBarSection,
  SyncUiEventDispatcher,
  ToolbarItemUtilities,
  ToolbarOrientation,
  ToolbarUsage,
} from "@itwin/appui-react";
import { FillCentered } from "@itwin/core-react";
import React from "react";

export class TestUiProvider implements UiItemsProvider {
  public readonly id = "TestUiProvider";
  public readonly syncEventId = "testuiitemsprovider:status-changed";
  private _visible = false;

  public provideToolbarButtonItems(
    _stageId: string,
    stageUsage: string,
    toolbarUsage: ToolbarUsage,
    toolbarOrientation: ToolbarOrientation
  ): ToolbarItem[] {
    if (
      stageUsage === StageUsage.General &&
      toolbarUsage === ToolbarUsage.ContentManipulation &&
      toolbarOrientation === ToolbarOrientation.Horizontal
    ) {
      const isHiddenCondition = new ConditionalBooleanValue(
        (): boolean => !this._visible,
        [this.syncEventId]
      );

      const iconCondition = new ConditionalStringValue(
        () => (this._visible ? "icon-visibility-hide-2" : "icon-visibility"),
        [this.syncEventId]
      );

      const visibilityActionSpec = ToolbarItemUtilities.createActionItem(
        "visibility-action-tool",
        200,
        iconCondition,
        "Set visibility",
        (): void => {
          this._visible = !this._visible;
          SyncUiEventDispatcher.dispatchImmediateSyncUiEvent(this.syncEventId);
          console.log(this._visible);
        }
      );

      const alertActionSpec = ToolbarItemUtilities.createActionItem(
        "alert-action-tool",
        210,
        "icon-developer",
        "Display an alert",
        (): void => {
          alert("Toolbar Button Item Clicked!");
        },
        { isHidden: isHiddenCondition }
      );

      return [visibilityActionSpec, alertActionSpec];
    }
    return [];
  }

  public provideStatusBarItems(
    _stageId: string,
    stageUsage: string
  ): StatusBarItem[] {
    const statusBarItems: StatusBarItem[] = [];

    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        StatusBarItemUtilities.createActionItem(
          "alert-statusbar-item",
          StatusBarSection.Center,
          100,
          "icon-developer",
          "Status bar item test",
          () => {
            alert("Status Bar Item Clicked!");
          }
        )
      );
    }

    return statusBarItems;
  }
}

export class TestUiProvider2 implements UiItemsProvider {
  public readonly id = "TestUiProvider2";

  public provideWidgets(
    stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection | undefined
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
