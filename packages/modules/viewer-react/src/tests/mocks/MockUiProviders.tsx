/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  AbstractStatusBarItemUtilities,
  AbstractWidgetProps,
  CommonStatusBarItem,
  CommonToolbarItem,
  ConditionalBooleanValue,
  ConditionalStringValue,
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  StatusBarSection,
  ToolbarItemUtilities,
  ToolbarOrientation,
  ToolbarUsage,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { SyncUiEventDispatcher } from "@itwin/appui-react";
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
  ): CommonToolbarItem[] {
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

      const visibilityActionSpec = ToolbarItemUtilities.createActionButton(
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

      const alertActionSpec = ToolbarItemUtilities.createActionButton(
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
  ): CommonStatusBarItem[] {
    const statusBarItems: CommonStatusBarItem[] = [];

    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        AbstractStatusBarItemUtilities.createActionItem(
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
