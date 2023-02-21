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
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "MessageCenter",
          StatusBarSection.Left,
          10,
          <MessageCenterField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.toolAssistance) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "ToolAssistance",
          StatusBarSection.Left,
          20,
          <ToolAssistanceField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.tileLoadIndicator) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "TileLoadIndicator",
          StatusBarSection.Right,
          10,
          <TileLoadingIndicator />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.accuSnapModePicker) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "SnapModeField",
          StatusBarSection.Right,
          20,
          <SnapModeField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionScope) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "SelectionScope",
          StatusBarSection.Right,
          30,
          <SelectionScopeField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionInfo) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
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
