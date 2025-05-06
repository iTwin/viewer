/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import type {
  StatusBarCustomItem,
  StatusBarItem,
  UiItemsProvider,
} from "@itwin/appui-react";
import {
  MessageCenterField,
  SelectionInfoField,
  SelectionScopeField,
  SnapModeField,
  StatusBarItemUtilities,
  StatusBarSection,
  TileLoadingIndicator,
  ToolAssistanceField,
} from "@itwin/appui-react";
import * as React from "react";

import type { ViewerDefaultStatusbarItems } from "../../../types";

export class ViewerStatusbarItemsProvider implements UiItemsProvider {
  public readonly id = "ViewerDefaultStatusbar";

  constructor(private _defaultItems?: ViewerDefaultStatusbarItems) {}

  public provideStatusBarItems(): StatusBarItem[] {
    const items: StatusBarCustomItem[] = [];

    if (!this._defaultItems || this._defaultItems.messageCenter) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "MessageCenter",
          section: StatusBarSection.Left,
          itemPriority: 10,
          content: <MessageCenterField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.toolAssistance) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "ToolAssistance",
          section: StatusBarSection.Left,
          itemPriority: 20,
          content: <ToolAssistanceField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.tileLoadIndicator) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "TileLoadIndicator",
          section: StatusBarSection.Right,
          itemPriority: 10,
          content: <TileLoadingIndicator />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.accuSnapModePicker) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "SnapModeField",
          section: StatusBarSection.Right,
          itemPriority: 20,
          content: <SnapModeField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionScope) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "SelectionScope",
          section: StatusBarSection.Right,
          itemPriority: 30,
          content: <SelectionScopeField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionInfo) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "SelectionInfo",
          section: StatusBarSection.Right,
          itemPriority: 40,
          content: <SelectionInfoField />,
        })
      );
    }

    return items;
  }
}
