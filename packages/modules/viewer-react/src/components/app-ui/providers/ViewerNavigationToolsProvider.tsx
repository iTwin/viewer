/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DefaultNavigationTools, ToolbarItem } from "@itwin/appui-react";
import { ToolbarOrientation, ToolbarUsage } from "@itwin/appui-react";
import { CoreTools } from "@itwin/appui-react";
import { ToolbarHelper, ToolItemDef } from "@itwin/appui-react";
import { StandardNavigationToolsUiItemsProvider } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";

export class ViewerNavigationToolsProvider extends StandardNavigationToolsUiItemsProvider {
  constructor(private defaultItems?: DefaultNavigationTools) {
    super({
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

  override get id(): string {
    return "ViewerDefaultNavigationTools";
  }

  // todo replace walk view tool with look and move tool
  override getToolbarItems(): readonly ToolbarItem[] {
    return super.getToolbarItems();
  }
}
