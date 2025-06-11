/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import {
  ConditionalBooleanValue,
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
import { Flex } from "@itwin/itwinui-react";
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

      function visibilityIcon({ syncEventId, isVisible }: { syncEventId: string, isVisible: boolean }) {
        const [update, setUpdate] = React.useState(false);

        React.useEffect(() => {
          const onSync = () => {
            setUpdate((prev) => !prev);
          }
          SyncUiEventDispatcher.onSyncUiEvent.addListener(onSync, syncEventId);
          return () => {
            SyncUiEventDispatcher.onSyncUiEvent.removeListener(onSync, syncEventId);
          }
        }, [syncEventId]);

        return (<i className={isVisible ? "icon-visibility-hide-2" : "icon-visibility"} />);
      }

      const visibilityActionSpec = ToolbarItemUtilities.createActionItem({
        id: "visibility-action-tool",
        label: "Set visibility",
        itemPriority: 200,
        execute: () => {
          this._visible = !this._visible;
          SyncUiEventDispatcher.dispatchImmediateSyncUiEvent(this.syncEventId);
          console.log(this._visible);
        },
        icon: visibilityIcon({ syncEventId: this.syncEventId, isVisible: this._visible }),
      });

      const alertActionSpec = ToolbarItemUtilities.createActionItem({
        id: "alert-action-tool",
        label: "Display an alert",
        itemPriority: 210,
        icon: <i className="icon-developer" />,
        execute: () => {
          alert("Toolbar Button Item Clicked!");
        },
        isHidden: isHiddenCondition,
      });

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
          icon: <i className="icon-developer" />,
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
        content: <Flex style={{ height: "100%", width: "100%" }}
          justifyContent="center"
          alignItems="center">Addon Widget in panel</Flex>,
      });
    }
    return widgets;
  }
}
