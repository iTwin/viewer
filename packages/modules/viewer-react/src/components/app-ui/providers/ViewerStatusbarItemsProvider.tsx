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
        StatusBarItemUtilities.createCustomItem(
          "MessageCenter",
          StatusBarSection.Left,
          10,
          <MessageCenterField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.toolAssistance) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "ToolAssistance",
          StatusBarSection.Left,
          20,
          <ToolAssistanceField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.tileLoadIndicator) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "TileLoadIndicator",
          StatusBarSection.Right,
          10,
          <TileLoadingIndicator />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.accuSnapModePicker) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "SnapModeField",
          StatusBarSection.Right,
          20,
          <SnapModeField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionScope) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "SelectionScope",
          StatusBarSection.Right,
          30,
          <SelectionScopeField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionInfo) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "SelectionInfo",
          StatusBarSection.Right,
          40,
          <SelectionInfoField />
        )
      );
    }

    return items;
  }
}
