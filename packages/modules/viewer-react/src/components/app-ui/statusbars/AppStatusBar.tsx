/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StatusBarSection } from "@itwin/appui-abstract";
import { FooterSeparator } from "@itwin/appui-layout-react";
import type { ConfigurableCreateInfo, StatusBarItem } from "@itwin/appui-react";
import { SectionsStatusField } from "@itwin/appui-react";
import {
  FooterModeField,
  MessageCenterField,
  SelectionInfoField,
  SelectionScopeField,
  SnapModeField,
  StatusBarComposer,
  StatusBarItemUtilities,
  StatusBarWidgetControl,
  TileLoadingIndicator,
  ToolAssistanceField,
  withMessageCenterFieldProps,
  withStatusFieldProps,
} from "@itwin/appui-react";
import * as React from "react";

/**
 * Status Bar example widget
 */
export class AppStatusBarWidget extends StatusBarWidgetControl {
  private _statusBarItems: StatusBarItem[] = [];
  private _footerModeOnlySeparator: () => React.ReactNode;

  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    const ToolAssistance = withStatusFieldProps(ToolAssistanceField);
    const MessageCenter = withMessageCenterFieldProps(MessageCenterField);
    const TileLoadIndicator = withStatusFieldProps(TileLoadingIndicator);
    const SelectionScope = withStatusFieldProps(SelectionScopeField);
    const FooterOnlyDisplay = withStatusFieldProps(FooterModeField);
    const SnapMode = withStatusFieldProps(SnapModeField);
    const SelectionInfo = withStatusFieldProps(SelectionInfoField);
    const Sections = withStatusFieldProps(SectionsStatusField);

    this._footerModeOnlySeparator = (): React.ReactNode => {
      return (
        <FooterOnlyDisplay>
          <FooterSeparator />
        </FooterOnlyDisplay>
      );
    };

    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "MessageCenter",
        StatusBarSection.Left,
        10,
        <MessageCenter />
      )
    );
    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "PreToolAssistance",
        StatusBarSection.Left,
        15,
        this._footerModeOnlySeparator()
      )
    );
    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "ToolAssistance",
        StatusBarSection.Left,
        20,
        <ToolAssistance />
      )
    );
    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "PostToolAssistance",
        StatusBarSection.Left,
        25,
        this._footerModeOnlySeparator()
      )
    );
    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "Sections",
        StatusBarSection.Left,
        30,
        <Sections hideWhenUnused={true} />
      )
    );

    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "TileLoadIndicator",
        StatusBarSection.Right,
        10,
        <TileLoadIndicator />
      )
    );
    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "SnapModeField",
        StatusBarSection.Right,
        20,
        <SnapMode />
      )
    );
    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "SelectionScope",
        StatusBarSection.Right,
        30,
        <SelectionScope />
      )
    );
    this._statusBarItems.push(
      StatusBarItemUtilities.createStatusBarItem(
        "SelectionInfo",
        StatusBarSection.Right,
        40,
        <SelectionInfo />
      )
    );
  }

  public getReactNode(): React.ReactNode {
    return <StatusBarComposer items={this._statusBarItems} />;
  }
}
