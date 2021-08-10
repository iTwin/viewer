/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { TreeWidgetUiItemsProvider } from "@bentley/tree-widget-react";
import { UiItemsManager, UiItemsProvider } from "@bentley/ui-abstract";
import { useEffect } from "react";

import { ItwinViewerUi } from "../types";

export function useUiProviders(
  customUiProviders?: UiItemsProvider[],
  defaultUiConfig?: ItwinViewerUi
): void {
  useEffect(() => {
    const defaultProviders: UiItemsProvider[] = [];

    if (!defaultUiConfig?.hideTreeView) {
      defaultProviders.push(new TreeWidgetUiItemsProvider());
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
