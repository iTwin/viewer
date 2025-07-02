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
  useActiveIModelConnection,
} from "@itwin/appui-react";
import { IModelConnection } from "@itwin/core-frontend";
import { getInstancesCount } from "@itwin/presentation-common";
import { Presentation } from "@itwin/presentation-frontend";
import { createIModelKey } from "@itwin/presentation-core-interop";
import {
  Selectables,
  SelectionStorage,
} from "@itwin/unified-selection";

import { useUnifiedSelectionScopes } from "../../../hooks/useUnifiedSelectionScopes.js";
import type { ViewerDefaultStatusbarItems } from "../../../types.js";

export class ViewerStatusbarItemsProvider implements UiItemsProvider {
  public readonly id = "ViewerDefaultStatusbar";

  constructor(private _defaultItems?: ViewerDefaultStatusbarItems) { }

  public provideStatusBarItems(): StatusBarItem[] {
    const items: StatusBarCustomItem[] = [];

    if (!this._defaultItems || this._defaultItems.messageCenter) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "MessageCenter",
          section: StatusBarSection.Left,
          itemPriority: 10,
          content: <MessageCenterField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.toolAssistance) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "ToolAssistance",
          section: StatusBarSection.Left,
          itemPriority: 20,
          content: <ToolAssistanceField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.tileLoadIndicator) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "TileLoadIndicator",
          section: StatusBarSection.Right,
          itemPriority: 10,
          content: <TileLoadingIndicator />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.accuSnapModePicker) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "SnapModeField",
          section: StatusBarSection.Right,
          itemPriority: 20,
          content: <SnapModeField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionScope) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "SelectionScope",
          section: StatusBarSection.Right,
          itemPriority: 30,
          content: <SelectionScopeField />,
        })
      );
    }
    if (!this._defaultItems || this._defaultItems.selectionInfo) {
      items.push(
        StatusBarItemUtilities.createCustomItem({
          id: "SelectionInfo",
          section: StatusBarSection.Right,
          itemPriority: 40,
          content: <SelectionCountField />,
        })
      );
    }

    return items;
  }
}

function SelectionCountField() {
  const imodel = useActiveIModelConnection();
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
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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
  const selection = Presentation.selection.getSelection(imodel);  // eslint-disable-line @typescript-eslint/no-deprecated
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
