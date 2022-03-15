/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type {
  CommonStatusBarItem,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { StatusBarSection } from "@itwin/appui-abstract";
import { FooterSeparator } from "@itwin/appui-layout-react";
import type { DefaultStatusbarItems, StatusBarItem } from "@itwin/appui-react";
import {
  FooterModeField,
  MessageCenterField,
  SelectionInfoField,
  SelectionScopeField,
  SnapModeField,
  StatusBarItemUtilities,
  TileLoadingIndicator,
  ToolAssistanceField,
  withMessageCenterFieldProps,
  withStatusFieldProps,
} from "@itwin/appui-react";
import * as React from "react";

export class ViewerStatusbarItemsProvider implements UiItemsProvider {
  public readonly id = "ViewerDefaultStatusbar";
  private _footerModeOnlySeparator: () => React.ReactNode;

  constructor(private _defaultItems?: DefaultStatusbarItems) {
    const FooterOnlyDisplay = withStatusFieldProps(FooterModeField);
    this._footerModeOnlySeparator = (): React.ReactNode => {
      return (
        <FooterOnlyDisplay>
          <FooterSeparator />
        </FooterOnlyDisplay>
      );
    };
  }

  public provideStatusBarItems(): CommonStatusBarItem[] {
    const ToolAssistance = withStatusFieldProps(ToolAssistanceField);
    const MessageCenter = withMessageCenterFieldProps(MessageCenterField);
    const TileLoadIndicator = withStatusFieldProps(TileLoadingIndicator);
    const SelectionScope = withStatusFieldProps(SelectionScopeField);
    const SnapMode = withStatusFieldProps(SnapModeField);
    const SelectionInfo = withStatusFieldProps(SelectionInfoField);
    const items: StatusBarItem[] = [];

    if (!this._defaultItems || this._defaultItems.messageCenter) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "MessageCenter",
          StatusBarSection.Left,
          10,
          <MessageCenter />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.preToolAssistanceSeparator) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "PreToolAssistance",
          StatusBarSection.Left,
          15,
          this._footerModeOnlySeparator()
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.toolAssistance) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "ToolAssistance",
          StatusBarSection.Left,
          20,
          <ToolAssistance />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.postToolAssistanceSeparator) {
      items.push(
        StatusBarItemUtilities.createStatusBarItem(
          "PostToolAssistance",
          StatusBarSection.Left,
          25,
          this._footerModeOnlySeparator()
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.tileLoadIndicator) {
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
