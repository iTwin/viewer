/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  StatusBarCustomItem,
  StatusBarItem,
  UiItemsProvider,
} from "@itwin/appui-react";
import * as React from "react";
import {
  MessageCenterField,
  SelectionCountField as AppUiSelectionCountField,
  SelectionScopeField as AppUiSelectionScopeField,
  SnapModeField,
  StatusBarItemUtilities,
  StatusBarSection,
  TileLoadingIndicator,
  ToolAssistanceField,
  UiFramework,
} from "@itwin/appui-react";
import { IModelConnection } from "@itwin/core-frontend";
import { getInstancesCount } from "@itwin/presentation-common";
import { createIModelKey } from "@itwin/presentation-core-interop";
import { Presentation } from "@itwin/presentation-frontend";
import { Selectables, SelectionStorage } from "@itwin/unified-selection";
import { useUnifiedSelectionScopes } from "../../../hooks/useUnifiedSelectionScopes";

import type { ViewerDefaultStatusbarItems } from "../../../types";

export class ViewerStatusbarItemsProvider implements UiItemsProvider {
  public readonly id = "ViewerDefaultStatusbar";

  constructor(private _defaultItems?: ViewerDefaultStatusbarItems) {}

  public provideStatusBarItems(): StatusBarItem[] {
    const items: StatusBarCustomItem[] = [];

    if (!this._defaultItems || this._defaultItems.messageCenter) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "MessageCenter",
          StatusBarSection.Left,
          10,
          <MessageCenterField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.toolAssistance) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "ToolAssistance",
          StatusBarSection.Left,
          20,
          <ToolAssistanceField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.tileLoadIndicator) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "TileLoadIndicator",
          StatusBarSection.Right,
          10,
          <TileLoadingIndicator />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.accuSnapModePicker) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "SnapModeField",
          StatusBarSection.Right,
          20,
          <SnapModeField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionScope) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "SelectionScope",
          StatusBarSection.Right,
          30,
          <SelectionScopeField />
        )
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionInfo) {
      items.push(
        StatusBarItemUtilities.createCustomItem(
          "SelectionInfo",
          StatusBarSection.Right,
          40,
          <SelectionCountField />
        )
      );
    }

    return items;
  }
}

function SelectionCountField() {
  const imodel = UiFramework.getIModelConnection();
  if (!imodel) {
    throw new Error(
      `IModel connection is not available for selection count toolbar field`
    );
  }

  const selectionStorage = React.useContext(selectionStorageContext);

  const [count, setCount] = React.useState(
    selectionStorage
      ? getSelectablesCountInStorage(selectionStorage, createIModelKey(imodel))
      : getInstancesCountInPresentationSelectionManager(imodel)
  );
  React.useEffect(() => {
    if (selectionStorage) {
      return selectionStorage.selectionChangeEvent.addListener(
        ({ imodelKey, level }) => {
          if (level !== 0) {
            return;
          }
          setCount(getSelectablesCountInStorage(selectionStorage, imodelKey));
        }
      );
    }
    return Presentation.selection.selectionChange.addListener((args) => {
      if (args.level !== 0) {
        return;
      }
      setCount(getInstancesCountInPresentationSelectionManager(imodel));
    });
  }, [selectionStorage, imodel]);

  return <AppUiSelectionCountField count={count} />;
}

const selectionStorageContext = React.createContext<
  SelectionStorage | undefined
>(undefined);

/** @internal */
export function SelectionStorageContextProvider({
  selectionStorage,
  children,
}: React.PropsWithChildren<{
  selectionStorage?: SelectionStorage | undefined;
}>) {
  return (
    <selectionStorageContext.Provider value={selectionStorage}>
      {children}
    </selectionStorageContext.Provider>
  );
}

function getSelectablesCountInStorage(
  storage: SelectionStorage,
  imodelKey: string
): number {
  const selection = storage.getSelection({ imodelKey });
  return Selectables.size(selection);
}

function getInstancesCountInPresentationSelectionManager(
  imodel: IModelConnection
) {
  const selection = Presentation.selection.getSelection(imodel);
  return getInstancesCount(selection);
}

function SelectionScopeField() {
  const ctx = React.useContext(selectionScopesContext);
  const selectionScopes = React.useMemo(
    () =>
      Object.entries(ctx.availableScopes).map(([id, { label }]) => ({
        id,
        label,
      })),
    [ctx.availableScopes]
  );
  return (
    <AppUiSelectionScopeField
      selectionScopes={selectionScopes}
      activeScope={ctx.activeScope.id}
      onChange={ctx.onScopeChange}
    />
  );
}

const selectionScopesContext = React.createContext<
  ReturnType<typeof useUnifiedSelectionScopes>
>({
  activeScope: { id: "element", def: "element" },
  availableScopes: {
    element: {
      label: "Element",
      def: "element",
    },
  },
  onScopeChange: () => {},
});

/** @internal */
export function SelectionScopesContextProvider({
  selectionScopes,
  children,
}: React.PropsWithChildren<{
  selectionScopes: ReturnType<typeof useUnifiedSelectionScopes>;
}>) {
  return (
    <selectionScopesContext.Provider value={selectionScopes}>
      {children}
    </selectionScopesContext.Provider>
  );
}
