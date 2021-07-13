/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Clone of core BasicNavigationWidget with conditional tooling
 */
import { IModelApp } from "@bentley/imodeljs-frontend";
import {
  CommonToolbarItem,
  ToolbarOrientation,
  ToolbarUsage,
} from "@bentley/ui-abstract";
import {
  CoreTools,
  NavigationWidgetComposer,
  ToolbarComposer,
  ToolbarHelper,
  ToolItemDef,
} from "@bentley/ui-framework";
import * as React from "react";

import { ViewNavigationTools } from "../../../types";
import { useUiVisibility } from "./BasicToolWidget";

export interface BasicNavigationWidgetProps {
  config?: ViewNavigationTools;
}

/** Basic Navigation Widget that provides standard tools to manipulate views containing element data.
 * Supports the specification of additional horizontal and vertical toolbar items through props.
 */
export function BasicNavigationWidget({
  config,
}: BasicNavigationWidgetProps): JSX.Element {
  const getHorizontalToolbarItems =
    React.useCallback((): CommonToolbarItem[] => {
      if (config?.hideDefaultHorizontalItems) {
        return [];
      }
      const items: CommonToolbarItem[] = [];

      if (
        config?.horizontalItems?.rotateView === undefined ||
        config?.horizontalItems?.rotateView === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            10,
            CoreTools.rotateViewCommand
          )
        );
      }
      if (
        config?.horizontalItems?.panView === undefined ||
        config?.horizontalItems?.panView === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            20,
            CoreTools.panViewCommand
          )
        );
      }
      if (
        config?.horizontalItems?.fitView === undefined ||
        config?.horizontalItems?.fitView === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            30,
            CoreTools.fitViewCommand
          )
        );
      }
      if (
        config?.horizontalItems?.windowArea === undefined ||
        config?.horizontalItems?.windowArea === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            40,
            CoreTools.windowAreaCommand
          )
        );
      }
      if (
        config?.horizontalItems?.undoView === undefined ||
        config?.horizontalItems?.undoView === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            50,
            CoreTools.viewUndoCommand
          )
        );
      }
      if (
        config?.horizontalItems?.redoView === undefined ||
        config?.horizontalItems?.redoView === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            60,
            CoreTools.viewRedoCommand
          )
        );
      }

      return items;
    }, [config]);

  const getVerticalToolbarItems = React.useCallback((): CommonToolbarItem[] => {
    if (config?.hideDefaultVerticalItems) {
      return [];
    }
    const items: CommonToolbarItem[] = [];

    if (
      config?.verticalItems?.walkView === undefined ||
      config?.verticalItems?.walkView === true
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
            labelKey: IModelApp.i18n.translate("iTwinViewer:tools.walkTool"),
          })
        )
      );
    }
    if (
      config?.verticalItems?.cameraView === undefined ||
      config?.verticalItems?.cameraView === true
    ) {
      items.push(
        ToolbarHelper.createToolbarItemFromItemDef(
          20,
          CoreTools.toggleCameraViewCommand
        )
      );
    }

    return items;
  }, [config]);

  const [horizontalItems, setHorizontalItems] = React.useState(() =>
    getHorizontalToolbarItems()
  );
  const [verticalItems, setVerticalItems] = React.useState(() =>
    getVerticalToolbarItems()
  );

  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setHorizontalItems(getHorizontalToolbarItems());
      setVerticalItems(getVerticalToolbarItems());
    }
  }, [getHorizontalToolbarItems, getVerticalToolbarItems]);

  const uiIsVisible = useUiVisibility();
  const className = !uiIsVisible ? "nz-hidden" : "";

  return (
    <NavigationWidgetComposer
      className={className}
      horizontalToolbar={
        <ToolbarComposer
          items={horizontalItems}
          usage={ToolbarUsage.ViewNavigation}
          orientation={ToolbarOrientation.Horizontal}
        />
      }
      verticalToolbar={
        <ToolbarComposer
          items={verticalItems}
          usage={ToolbarUsage.ViewNavigation}
          orientation={ToolbarOrientation.Vertical}
        />
      }
    />
  );
}
