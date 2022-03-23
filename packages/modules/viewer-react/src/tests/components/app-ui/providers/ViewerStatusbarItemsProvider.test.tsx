/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { StageUsage, UiItemsManager } from "@itwin/appui-abstract";

import { ViewerStatusbarItemsProvider } from "../../../../components/app-ui/providers";
import type { ViewerDefaultStatusbarItems } from "../../../../types";

const testArray: { items: ViewerDefaultStatusbarItems; amount: number }[] = [
  {
    items: {},
    amount: 0,
  },
  {
    items: { messageCenter: true },
    amount: 1,
  },
  {
    items: {
      messageCenter: false,
      tileLoadIndicator: true,
      selectionInfo: true,
      selectionScope: true,
    },
    amount: 3,
  },
  {
    items: {
      messageCenter: true,
      toolAssistance: true,
      accuSnapModePicker: true,
      tileLoadIndicator: true,
      selectionScope: true,
      selectionInfo: true,
    },
    amount: 6,
  },
];

describe("ViewerDefaultStatusbarProvider", () => {
  it("should register ViewerStatusbarItemsProvider with 8 default items", () => {
    const provider = new ViewerStatusbarItemsProvider();
    UiItemsManager.register(provider);
    expect(UiItemsManager.hasRegisteredProviders).toBeTruthy();
    expect(
      UiItemsManager.getStatusBarItems("test", StageUsage.General).length
    ).toBe(8);
    UiItemsManager.unregister(provider.id);
    expect(UiItemsManager.hasRegisteredProviders).toBeFalsy();
  });

  it("should register ViewerStatusbarItemsProvider with the items specified from test array", () => {
    testArray.forEach(({ items, amount }) => {
      const provider = new ViewerStatusbarItemsProvider(items);
      UiItemsManager.register(provider);
      expect(UiItemsManager.hasRegisteredProviders).toBeTruthy();
      expect(
        UiItemsManager.getStatusBarItems("test", StageUsage.General).length
      ).toBe(amount);
      UiItemsManager.unregister(provider.id);
      expect(UiItemsManager.hasRegisteredProviders).toBeFalsy();
    });
  });
});
