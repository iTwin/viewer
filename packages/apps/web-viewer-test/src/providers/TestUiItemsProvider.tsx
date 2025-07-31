/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { CommonToolbarItem } from "@itwin/appui-abstract";
import {
  ConditionalBooleanValue,
  ConditionalStringValue,
  ToolbarItemUtilities,
} from "@itwin/appui-abstract";
import type { StatusBarItem, UiItemsProvider } from "@itwin/appui-react";
import {
  StageUsage,
  StatusBarItemUtilities,
  StatusBarSection,
  ToolbarOrientation,
  ToolbarUsage,
} from "@itwin/appui-react";
import { SyncUiEventDispatcher } from "@itwin/appui-react";

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
  ): StatusBarItem[] {
    const statusBarItems: StatusBarItem[] = [];

    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        StatusBarItemUtilities.createActionItem({
          id: "alert-statusbar-item",
          itemPriority: 100,
          icon: <i className="icon icon-developer" />,
          label: "Status bar item test",
          execute: () => {
            alert("Status Bar Item Clicked!");
          },
          section: StatusBarSection.Center,
        })
      );
    }

    return statusBarItems;
  }
}
