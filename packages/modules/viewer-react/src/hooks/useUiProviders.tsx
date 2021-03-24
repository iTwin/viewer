/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UiItemsManager, UiItemsProvider } from "@bentley/ui-abstract";
import { useEffect } from "react";

export function useUiProviders(uiProviders?: UiItemsProvider[]): void {
  useEffect(() => {
    if (uiProviders) {
      uiProviders.forEach((uiProvider) => {
        UiItemsManager.register(uiProvider);
      });
      return () => {
        uiProviders.forEach((uiProvider) => {
          UiItemsManager.unregister(uiProvider.id);
        });
      };
    }
  }, [uiProviders]);
}
