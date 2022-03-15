/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { CommonStatusBarItem } from "@itwin/appui-abstract";
import { StatusBarSection } from "@itwin/appui-abstract";
import type { DefaultContentTools } from "@itwin/appui-react";
import {
  SectionsStatusField,
  StandardContentToolsProvider,
  StatusBarItemUtilities,
  withStatusFieldProps,
} from "@itwin/appui-react";
import * as React from "react";

export class ViewerContentToolsProvider extends StandardContentToolsProvider {
  private _viewerDefaults: DefaultContentTools;

  constructor(defaultItems?: DefaultContentTools) {
    let viewerDefaults = defaultItems;
    // by default, don't show the measure tools
    if (!viewerDefaults) {
      viewerDefaults = {
        horizontal: {
          clearSelection: true,
          clearDisplayOverrides: true,
          hide: "element",
          isolate: "element",
          emphasize: "element",
        },
        vertical: {
          selectElement: true,
          measureGroup: false,
          sectionGroup: true,
        },
      };
    }
    super("ViewerDefaultContentTools", viewerDefaults);
    this._viewerDefaults = viewerDefaults;
  }

  // need to override this method to move sectioning "clear" tool to its proper position on the left
  public override provideStatusBarItems(): CommonStatusBarItem[] {
    const statusBarItems: CommonStatusBarItem[] = [];

    // if the sectionGroup tools are to be shown then we want the status field added to allow clearing or manipulation the section
    if (
      !this._viewerDefaults ||
      !this._viewerDefaults.vertical ||
      this._viewerDefaults.vertical.sectionGroup
    ) {
      const Sections = withStatusFieldProps(SectionsStatusField);
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "uifw.Sections",
          StatusBarSection.Left,
          30,
          <Sections hideWhenUnused />
        )
      );
    }

    return statusBarItems;
  }
}
