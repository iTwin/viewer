/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { UiItemsProvider } from "@itwin/appui-abstract";
import { UiItemsManager } from "@itwin/appui-abstract";
import { MeasureToolsUiItemsProvider } from "@itwin/measure-tools-react";
import { PropertyGridUiItemsProvider } from "@itwin/property-grid-react";
import { TreeWidgetUiItemsProvider } from "@itwin/tree-widget-react";
import { useEffect } from "react";

import { BackstageItemsProvider } from "../components/app-ui/providers";
import type { ViewerBackstageItem } from "../types";
import type { ItwinViewerUi } from "../types";

export function useUiProviders(
  customUiProviders?: UiItemsProvider[],
  defaultUiConfig?: ItwinViewerUi,
  backstageItems?: ViewerBackstageItem[]
): void {
  useEffect(() => {
    const defaultProviders: UiItemsProvider[] = [];

    if (!defaultUiConfig?.hideTreeView) {
      defaultProviders.push(new TreeWidgetUiItemsProvider());
    }
    if (!defaultUiConfig?.hidePropertyGrid) {
      defaultProviders.push(
        new PropertyGridUiItemsProvider({
          enableCopyingPropertyText: true,
        })
      );
    }
    if (
      !defaultUiConfig?.contentManipulationTools?.hideDefaultVerticalItems &&
      (defaultUiConfig?.contentManipulationTools?.verticalItems
        ?.measureTools === undefined ||
        defaultUiConfig?.contentManipulationTools?.verticalItems
          ?.measureTools === true)
    ) {
      defaultProviders.push(new MeasureToolsUiItemsProvider());
    }

    if (backstageItems && backstageItems.length > 0) {
      defaultProviders.push(new BackstageItemsProvider(backstageItems));
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
  }, [customUiProviders, defaultUiConfig, backstageItems]);
}
