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

export class BackstageItemsProvider implements UiItemsProvider {
  public readonly id = "BackstageItemsProvider";
  private _backstageItems: ViewerBackstageItem[];

  constructor(backstageItems: ViewerBackstageItem[]) {
    this._backstageItems = backstageItems;
  }

  public provideBackstageItems() {
    const allBackstageItems: ViewerBackstageItem[] = [];
    this._backstageItems.forEach((backstageItem) => {
      // check for label i18n key and translate if needed
      if (backstageItem.labeli18nKey) {
        let newItem;
        if ((backstageItem as BackstageStageLauncher).stageId) {
          newItem = BackstageItemUtilities.createStageLauncher(
            (backstageItem as BackstageStageLauncher).stageId,
            backstageItem.groupPriority,
            backstageItem.itemPriority,
            IModelApp.localization.getLocalizedString(
              backstageItem.labeli18nKey
            ),
            backstageItem.subtitle?.toString(),
            backstageItem.icon?.toString()
          );
        } else {
          newItem = BackstageItemUtilities.createActionItem(
            backstageItem.id,
            backstageItem.groupPriority,
            backstageItem.itemPriority,
            (backstageItem as BackstageActionItem).execute,
            IModelApp.localization.getLocalizedString(
              backstageItem.labeli18nKey
            ),
            backstageItem.subtitle?.toString(),
            backstageItem.icon?.toString()
          );
        }
        allBackstageItems.push(newItem);
      } else {
        allBackstageItems.push(backstageItem);
      }
    });

    // add a launcher item for the built-in frontstage if there is an active connection and other backstage items
    if (allBackstageItems?.length > 0 && UiFramework.getIModelConnection()) {
      allBackstageItems.unshift({
        stageId: "DefaultFrontstage",
        id: "DefaultFrontstage",
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
