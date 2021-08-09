/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { TreeWidgetUiItemsProvider } from "@bentley/tree-widget-react/lib/components/TreeWidgetUiItemsProvider";
import { UiItemsManager, UiItemsProvider } from "@bentley/ui-abstract";
import { useEffect } from "react";

export function useUiProviders(uiProviders?: UiItemsProvider[]): void {
  useEffect(() => {
    const defaultProviders: UiItemsProvider[] = [
      new TreeWidgetUiItemsProvider(),
    ];

    const _uiProviders = uiProviders
      ? uiProviders.concat(defaultProviders)
      : defaultProviders;

    _uiProviders.forEach((uiProvider) => {
      UiItemsManager.register(uiProvider);
    });

    return () => {
      _uiProviders.forEach((uiProvider) => {
        UiItemsManager.unregister(uiProvider.id);
      });
    };
  }, [uiProviders]);
}
