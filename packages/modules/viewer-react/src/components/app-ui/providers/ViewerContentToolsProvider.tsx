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
  constructor(private _defaultItems?: DefaultContentTools) {
    super(
      "ViewerDefaultContentTools",
      (_defaultItems = {
        vertical: {
          measureGroup:
            typeof _defaultItems?.vertical?.measureGroup === "undefined" ||
            _defaultItems?.vertical?.measureGroup
              ? true
              : false,
          sectionGroup:
            typeof _defaultItems?.vertical?.sectionGroup === "undefined" ||
            _defaultItems?.vertical?.sectionGroup
              ? true
              : false,
          selectElement:
            typeof _defaultItems?.vertical?.selectElement === "undefined" ||
            _defaultItems?.vertical?.selectElement
              ? true
              : false,
        },
      })
    );
  }

  // need to override this method to move sectioning "clear" tool to its proper position on the left
  public override provideStatusBarItems(): CommonStatusBarItem[] {
    const statusBarItems: CommonStatusBarItem[] = [];

    // if the sectionGroup tools are to be shown then we want the status field added to allow clearing or manipulation the section
    if (
      !this._defaultItems?.vertical ||
      this._defaultItems.vertical.sectionGroup
    ) {
      const Sections = withStatusFieldProps(SectionsStatusField);
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "Sections",
          StatusBarSection.Left,
          30,
          <Sections hideWhenUnused />
        )
      );
    }

    return statusBarItems;
  }
}
