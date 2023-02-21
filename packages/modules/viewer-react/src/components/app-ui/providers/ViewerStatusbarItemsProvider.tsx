/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  CommonStatusBarItem,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { StatusBarSection } from "@itwin/appui-abstract";
import type { StatusBarItem } from "@itwin/appui-react";
import {
  MessageCenterField,
  SelectionInfoField,
  SelectionScopeField,
  SnapModeField,
  StatusBarItemUtilities,
  TileLoadingIndicator,
  ToolAssistanceField,
} from "@itwin/appui-react";
import * as React from "react";

import type { ViewerDefaultStatusbarItems } from "../../../types";

export class ViewerStatusbarItemsProvider implements UiItemsProvider {
  public readonly id = "ViewerDefaultStatusbar";

  constructor(private _defaultItems?: ViewerDefaultStatusbarItems) {}

  public provideStatusBarItems(): CommonStatusBarItem[] {
    const items: StatusBarItem[] = [];

    if (!this._defaultItems || this._defaultItems.messageCenter) {
      const MessageCenter = MessageCenterField;
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "MessageCenter",
          StatusBarSection.Left,
          10,
          <MessageCenter />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.toolAssistance) {
      const ToolAssistance = ToolAssistanceField;
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "ToolAssistance",
          StatusBarSection.Left,
          20,
          <ToolAssistance />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.tileLoadIndicator) {
      const TileLoadIndicator = TileLoadingIndicator;
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "TileLoadIndicator",
          StatusBarSection.Right,
          10,
          <TileLoadIndicator />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.accuSnapModePicker) {
      const SnapMode = SnapModeField;
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "SnapModeField",
          StatusBarSection.Right,
          20,
          <SnapMode />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionScope) {
      const SelectionScope = SelectionScopeField;
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "SelectionScope",
          StatusBarSection.Right,
          30,
          <SelectionScope />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionInfo) {
      const SelectionInfo = SelectionInfoField;
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "SelectionInfo",
          StatusBarSection.Right,
          40,
          <SelectionInfo />
        )
      );
    }

    return items;
  }
}
