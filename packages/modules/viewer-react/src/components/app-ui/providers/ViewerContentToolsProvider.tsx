/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DefaultContentTools, StatusBarItem } from "@itwin/appui-react";
import {
  SectionsStatusField,
  StandardContentToolsUiItemsProvider,
  StatusBarItemUtilities,
  StatusBarSection,
} from "@itwin/appui-react";
import * as React from "react";

export class ViewerContentToolsProvider extends StandardContentToolsUiItemsProvider {
  constructor(private _defaultItems?: DefaultContentTools) {
    super({
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

  public override get id(): string {
    return "ViewerContentToolsProvider";
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
        StatusBarItemUtilities.createCustomItem({
          id: "Sections",
          section: StatusBarSection.Left,
          itemPriority: 30,
          content: <SectionsStatusField hideWhenUnused />,
        })
      );
    }

    return statusBarItems;
  }
}
