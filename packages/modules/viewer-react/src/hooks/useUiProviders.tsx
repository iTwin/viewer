/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// TODO 3.0 re-add
// import { PropertyGridUiItemsProvider } from "@bentley/property-grid-react";
// import { TreeWidgetUiItemsProvider } from "@bentley/tree-widget-react";
import type { UiItemsProvider } from "@itwin/appui-abstract";
import { UiItemsManager } from "@itwin/appui-abstract";
import { MeasureToolsUiItemsProvider } from "@itwin/measure-tools-react";
import { useEffect } from "react";

import type { ItwinViewerUi } from "../types";

export function useUiProviders(
  customUiProviders?: UiItemsProvider[],
  defaultUiConfig?: ItwinViewerUi
): void {
  useEffect(() => {
    const defaultProviders: UiItemsProvider[] = [];

    // TODO 3.0 re-add
    // if (!defaultUiConfig?.hideTreeView) {
    //   defaultProviders.push(new TreeWidgetUiItemsProvider());
    // }
    // if (!defaultUiConfig?.hidePropertyGrid) {
    //   defaultProviders.push(new PropertyGridUiItemsProvider());
    // }
    if (
      !defaultUiConfig?.contentManipulationTools?.verticalItems?.measureTools
    ) {
      defaultProviders.push(new MeasureToolsUiItemsProvider());
    }

    const uiProviders = customUiProviders
      ? customUiProviders.concat(defaultProviders)
      : defaultProviders;

    uiProviders.forEach((uiProvider) => {
      UiItemsManager.register(uiProvider);
    });

    return () => {
      uiProviders.forEach((uiProvider) => {
        UiItemsManager.unregister(uiProvider.id);
      });
    };
  }, [customUiProviders, defaultUiConfig]);
}
