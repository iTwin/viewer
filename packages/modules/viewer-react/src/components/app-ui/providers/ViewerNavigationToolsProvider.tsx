/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { CommonToolbarItem } from "@itwin/appui-abstract";
import {
  StageUsage,
  ToolbarOrientation,
  ToolbarUsage,
} from "@itwin/appui-abstract";
import type { DefaultNavigationTools } from "@itwin/appui-react";
import { ToolbarHelper, ToolItemDef } from "@itwin/appui-react";
import { StandardNavigationToolsProvider } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";

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

  public override provideToolbarButtonItems(
    stageId: string,
    stageUsage: string,
    toolbarUsage: ToolbarUsage,
    toolbarOrientation: ToolbarOrientation
  ): CommonToolbarItem[] {
    const items: CommonToolbarItem[] = super.provideToolbarButtonItems(
      stageId,
      stageUsage,
      toolbarUsage,
      toolbarOrientation
    );

    if (
      stageUsage === StageUsage.General &&
      toolbarUsage === ToolbarUsage.ViewNavigation &&
      toolbarOrientation === ToolbarOrientation.Vertical
    ) {
      items.push(
        ToolbarHelper.createToolbarItemFromItemDef(
          10,
          new ToolItemDef({
            toolId: "View.LookAndMove",
            iconSpec: "icon-walk",
            execute: () =>
              IModelApp.tools.run(
                "View.LookAndMove",
                IModelApp.viewManager.selectedView
              ),
            labelKey: "iTwinViewer:tools.walkTool",
          })
        )
      );
    }

    return items;
  }
}
