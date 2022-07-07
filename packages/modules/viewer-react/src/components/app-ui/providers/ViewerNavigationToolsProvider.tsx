/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DefaultNavigationTools } from "@itwin/appui-react";

import { StandardNavigationToolsProvider } from "./StandardNavigationToolsProvider";

export class ViewerNavigationToolsProvider extends StandardNavigationToolsProvider {
  constructor(defaultItems?: DefaultNavigationTools) {
    super("ViewerDefaultNavigationTools", {
      horizontal: {
        fitView: true,
        panView: true,
        rotateView: true,
        viewUndoRedo: true,
        windowArea: true,
        ...defaultItems?.horizontal,
      },
      vertical: {
        toggleCamera: true,
        walk: true,
        ...defaultItems?.vertical,
      },
    });
  }
}
