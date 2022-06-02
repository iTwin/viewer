/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DefaultNavigationTools } from "@itwin/appui-react";
import { StandardNavigationToolsProvider } from "@itwin/appui-react";

export class ViewerNavigationToolsProvider extends StandardNavigationToolsProvider {
  constructor(defaultItems?: DefaultNavigationTools) {
    super(
      "ViewerDefaultNavigationTools",
      (defaultItems = {
        horizontal: {
          fitView: defaultItems?.horizontal?.fitView ?? true,
          panView: defaultItems?.horizontal?.panView ?? true,
          rotateView: defaultItems?.horizontal?.rotateView ?? true,
          viewUndoRedo: defaultItems?.horizontal?.viewUndoRedo ?? true,
          windowArea: defaultItems?.horizontal?.windowArea ?? true,
        },
        vertical: {
          toggleCamera: defaultItems?.vertical?.toggleCamera ?? true,
          walk: defaultItems?.vertical?.walk ?? true,
        },
      })
    );
  }
}
