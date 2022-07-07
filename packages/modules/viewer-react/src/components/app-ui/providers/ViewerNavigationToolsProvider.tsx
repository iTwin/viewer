/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { CommonToolbarItem } from "@itwin/appui-abstract";
import { ToolbarOrientation, ToolbarUsage } from "@itwin/appui-abstract";
import type { DefaultNavigationTools } from "@itwin/appui-react";
import { CoreTools } from "@itwin/appui-react";
import { ToolbarHelper, ToolItemDef } from "@itwin/appui-react";
import { StandardNavigationToolsProvider } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";

export class ViewerNavigationToolsProvider extends StandardNavigationToolsProvider {
  constructor(private defaultItems?: DefaultNavigationTools) {
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
    const items: CommonToolbarItem[] = [];

    if (
      toolbarUsage === ToolbarUsage.ViewNavigation &&
      toolbarOrientation === ToolbarOrientation.Horizontal
    ) {
      if (
        !this.defaultItems ||
        !this.defaultItems.horizontal ||
        this.defaultItems.horizontal.rotateView
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            10,
            CoreTools.rotateViewCommand
          )
        );
      }
      if (
        !this.defaultItems ||
        !this.defaultItems.horizontal ||
        this.defaultItems.horizontal.panView
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            20,
            CoreTools.panViewCommand
          )
        );
      }
      if (
        !this.defaultItems ||
        !this.defaultItems.horizontal ||
        this.defaultItems.horizontal.fitView
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            30,
            CoreTools.fitViewCommand
          )
        );
      }
      if (
        !this.defaultItems ||
        !this.defaultItems.horizontal ||
        this.defaultItems.horizontal.windowArea
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            40,
            CoreTools.windowAreaCommand
          )
        );
      }
      if (
        !this.defaultItems ||
        !this.defaultItems.horizontal ||
        this.defaultItems.horizontal.viewUndoRedo
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            50,
            CoreTools.viewUndoCommand
          )
        );
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            60,
            CoreTools.viewRedoCommand
          )
        );
      }
    } else if (
      toolbarUsage === ToolbarUsage.ViewNavigation &&
      toolbarOrientation === ToolbarOrientation.Vertical
    ) {
      if (
        !this.defaultItems ||
        !this.defaultItems.vertical ||
        this.defaultItems.vertical.walk
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
      if (
        !this.defaultItems ||
        !this.defaultItems.vertical ||
        this.defaultItems.vertical.toggleCamera
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            20,
            CoreTools.toggleCameraViewCommand
          )
        );
      }
    }
    return items;
  }
}
