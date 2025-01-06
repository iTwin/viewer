/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BackstageActionItem,
  BackstageStageLauncher,
  UiItemsProvider,
} from "@itwin/appui-react";
import { BackstageItemUtilities, UiFramework } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";

import type { ViewerBackstageItem } from "../../../types";

// todo remove icon in favor of iconNode
export class BackstageItemsProvider implements UiItemsProvider {
  constructor(
    private _backstageItems: ViewerBackstageItem[],
    public readonly id = "iTwinViewer.BackstageItemsProvider"
  ) {}

  public getBackstageItems() {
    const allBackstageItems: ViewerBackstageItem[] = [];
    this._backstageItems.forEach((backstageItem) => {
      // check for label i18n key and translate if needed
      if (backstageItem.labeli18nKey) {
        let newItem;
        if ((backstageItem as BackstageStageLauncher).stageId) {
          newItem = BackstageItemUtilities.createStageLauncher({
            stageId: (backstageItem as BackstageStageLauncher).stageId,
            groupPriority: backstageItem.groupPriority,
            itemPriority: backstageItem.itemPriority,
            label: IModelApp.localization.getLocalizedString(
              backstageItem.labeli18nKey
            ),
            subtitle: backstageItem.subtitle?.toString(),
            icon: backstageItem.icon?.toString(), // eslint-disable-line deprecation/deprecation
          });
        } else {
          newItem = BackstageItemUtilities.createActionItem({
            id: backstageItem.id,
            groupPriority: backstageItem.groupPriority,
            itemPriority: backstageItem.itemPriority,
            execute: (backstageItem as BackstageActionItem).execute,
            label: IModelApp.localization.getLocalizedString(
              backstageItem.labeli18nKey
            ),
            subtitle: backstageItem.subtitle?.toString(),
            icon: backstageItem.icon?.toString(), // eslint-disable-line deprecation/deprecation
          });
        }
        allBackstageItems.push(newItem);
      } else {
        allBackstageItems.push(backstageItem);
      }
    });

    // add a launcher item for the built-in frontstage if there is an active connection and other backstage items
    if (allBackstageItems?.length > 0 && UiFramework.getIModelConnection()) {
      allBackstageItems.unshift({
        stageId: "iTwinViewer.DefaultFrontstage",
        id: "iTwinViewer.DefaultFrontstage",
        groupPriority: 100,
        itemPriority: 10,
        label: IModelApp.localization.getLocalizedString(
          "iTwinViewer:backstage.mainFrontstage"
        ),
      });
    }
    return allBackstageItems;
  }
}
