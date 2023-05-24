/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DefaultContentTools, StatusBarItem } from "@itwin/appui-react";
import {
  SectionsStatusField,
  StandardContentToolsProvider,
  StatusBarItemUtilities,
  StatusBarSection,
} from "@itwin/appui-react";
import * as React from "react";

export class ViewerContentToolsProvider extends StandardContentToolsProvider {
  constructor(private _defaultItems?: DefaultContentTools) {
    super("ViewerDefaultContentTools", {
      horizontal: {
        clearSelection: true,
        clearDisplayOverrides: true,
        hide: "element",
        isolate: "element",
        emphasize: "element",
        ..._defaultItems?.horizontal,
      },
      vertical: {
        measureGroup: true,
        sectionGroup: true,
        selectElement: true,
        ..._defaultItems?.vertical,
      },
    });
  }

  // need to override this method to move sectioning "clear" tool to its proper position on the left
  public override provideStatusBarItems(): StatusBarItem[] {
    const statusBarItems: StatusBarItem[] = [];

    // if the sectionGroup tools are to be shown then we want the status field added to allow clearing or manipulation the section
    if (
      !this._defaultItems?.vertical ||
      this._defaultItems.vertical.sectionGroup
    ) {
      statusBarItems.push(
        StatusBarItemUtilities.createCustomItem(
          "Sections",
          StatusBarSection.Left,
          30,
          <SectionsStatusField hideWhenUnused />
        )
      );
    }

    return statusBarItems;
  }
}
