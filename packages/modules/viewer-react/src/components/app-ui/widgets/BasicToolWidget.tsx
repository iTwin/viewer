/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/** Clone of core BasicToolWidget with conditional tooling
 */
import type { CommonToolbarItem } from "@itwin/appui-abstract";
import { ToolbarOrientation, ToolbarUsage } from "@itwin/appui-abstract";
import type { UiVisibilityEventArgs } from "@itwin/appui-react";
import {
  BackstageAppButton,
  CoreTools,
  SelectionContextToolDefinitions,
  ToolbarComposer,
  ToolbarHelper,
  ToolWidgetComposer,
  UiFramework,
} from "@itwin/appui-react";
import * as React from "react";

import type { ContentManipulationTools } from "../../../types";

export function useUiVisibility(): boolean {
  const [uiIsVisible, setUiIsVisible] = React.useState(
    UiFramework.getIsUiVisible()
  );
  React.useEffect(() => {
    const handleUiVisibilityChanged = (args: UiVisibilityEventArgs): void =>
      setUiIsVisible(args.visible);
    UiFramework.onUiVisibilityChanged.addListener(handleUiVisibilityChanged);
    return () => {
      UiFramework.onUiVisibilityChanged.removeListener(
        handleUiVisibilityChanged
      );
    };
  }, []);
  return uiIsVisible;
}

interface BasicToolWidgetProps {
  config?: ContentManipulationTools;
}

/** Default Tool Widget for standard "review" applications. Provides standard tools to review, and measure elements.
 * This definition will also show a overflow button if there is not enough room to display all the toolbar buttons.
 */
export function BasicToolWidget({ config }: BasicToolWidgetProps): JSX.Element {
  const getHorizontalToolbarItems =
    React.useCallback((): CommonToolbarItem[] => {
      if (config?.hideDefaultHorizontalItems) {
        return [];
      }
      const items: CommonToolbarItem[] = [];

      if (
        config?.horizontalItems?.clearSelection === undefined ||
        config?.horizontalItems?.clearSelection === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            10,
            CoreTools.clearSelectionItemDef
          )
        );
      }
      if (
        config?.horizontalItems?.clearHideIsolateEmphasizeElements ===
          undefined ||
        config?.horizontalItems?.clearHideIsolateEmphasizeElements === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            20,
            SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
          )
        );
      }
      if (
        config?.horizontalItems?.hideElements === undefined ||
        config?.horizontalItems?.hideElements === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            30,
            SelectionContextToolDefinitions.hideElementsItemDef
          )
        );
      }
      if (
        config?.horizontalItems?.isolateElements === undefined ||
        config?.horizontalItems?.isolateElements === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            40,
            SelectionContextToolDefinitions.isolateElementsItemDef
          )
        );
      }
      if (
        config?.horizontalItems?.emphasizeElements === undefined ||
        config?.horizontalItems?.emphasizeElements === true
      ) {
        items.push(
          ToolbarHelper.createToolbarItemFromItemDef(
            50,
            SelectionContextToolDefinitions.emphasizeElementsItemDef
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
      config?.verticalItems?.selectTool === undefined ||
      config?.verticalItems?.selectTool === true
    ) {
      items.push(
        ToolbarHelper.createToolbarItemFromItemDef(
          10,
          CoreTools.selectElementCommand
        )
      );
    }
    if (
      config?.verticalItems?.sectionTools === undefined ||
      config?.verticalItems?.sectionTools === true
    ) {
      items.push(
        ToolbarHelper.createToolbarItemFromItemDef(
          20,
          CoreTools.sectionToolGroup
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
    <ToolWidgetComposer
      className={className}
      cornerItem={
        config?.cornerItem?.item ? (
          config?.cornerItem?.item
        ) : config?.cornerItem?.hideDefault ? undefined : (
          <BackstageAppButton />
        )
      }
      horizontalToolbar={
        <ToolbarComposer
          items={horizontalItems}
          usage={ToolbarUsage.ContentManipulation}
          orientation={ToolbarOrientation.Horizontal}
        />
      }
      verticalToolbar={
        <ToolbarComposer
          items={verticalItems}
          usage={ToolbarUsage.ContentManipulation}
          orientation={ToolbarOrientation.Vertical}
        />
      }
    />
  );
}
