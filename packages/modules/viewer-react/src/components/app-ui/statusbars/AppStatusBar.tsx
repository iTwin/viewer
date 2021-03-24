/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StatusBarSection } from "@bentley/ui-abstract";
import {
  ClearEmphasisStatusField,
  ConfigurableCreateInfo,
  FooterModeField,
  MessageCenterField,
  SelectionScopeField,
  SnapModeField,
  StatusBarComposer,
  StatusBarItem,
  StatusBarItemUtilities,
  StatusBarWidgetControl,
  TileLoadingIndicator,
  ToolAssistanceField,
  withMessageCenterFieldProps,
  withStatusFieldProps,
} from "@bentley/ui-framework";
import { FooterSeparator } from "@bentley/ui-ninezone";
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
    const ClearEmphasis = withStatusFieldProps(ClearEmphasisStatusField);
    const TileLoadIndicator = withStatusFieldProps(TileLoadingIndicator);
    const SelectionScope = withStatusFieldProps(SelectionScopeField);
    const FooterOnlyDisplay = withStatusFieldProps(FooterModeField);
    const SnapMode = withStatusFieldProps(SnapModeField);

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
        "ClearEmphasis",
        StatusBarSection.Center,
        30,
        <ClearEmphasis hideWhenUnused={true} />
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
  }

  public getReactNode(): React.ReactNode {
    return <StatusBarComposer items={this._statusBarItems} />;
  }
}
