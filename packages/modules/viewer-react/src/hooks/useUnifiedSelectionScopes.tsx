/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IModelConnection } from "@itwin/core-frontend";
import React from "react";
import { Presentation } from "@itwin/presentation-frontend";
import { computeSelection } from "@itwin/unified-selection";
import { SelectionScopesProps } from "../types";

type SelectionScope = Parameters<typeof computeSelection>[0]["scope"];
type SelectionScopesMap = SelectionScopesProps["available"];

interface UseUnifiedSelectionScopesProps {
  iModelConnection?: IModelConnection;
  selectionScopes?: SelectionScopesProps;
}

/** @internal */
export function useUnifiedSelectionScopes({
  iModelConnection,
  selectionScopes,
}: UseUnifiedSelectionScopesProps) {
  const [availableScopes, setAvailableScopes] =
    React.useState<SelectionScopesMap>(defaultAvailableScopes);
  React.useEffect(() => {
    if (selectionScopes?.available) {
      setAvailableScopes(selectionScopes.available);
      return;
    }

    let isDisposed = false;
    if (iModelConnection?.isOpen) {
      void Presentation.selection.scopes  // eslint-disable-line @typescript-eslint/no-deprecated
        .getSelectionScopes(iModelConnection)
        .then((presentationFrontendScopes) => {
          !isDisposed &&
            setAvailableScopes(
              presentationFrontendScopes.reduce(
                (map, scope) => ({
                  ...map,
                  [scope.id]: {
                    label: scope.label,
                    def: convertPresentationFrontendScope(scope.id),
                  },
                }),
                {}
              )
            );
        });
      return;
    }

    setAvailableScopes(defaultAvailableScopes);
    return () => {
      isDisposed = true;
    };
  }, [selectionScopes?.available, iModelConnection]);

  const [activeScope, setActiveScope] = React.useState<{
    id: string;
    def: SelectionScope;
  }>(getActiveScope(selectionScopes));
  React.useEffect(() => {
    setActiveScope(getActiveScope(selectionScopes));
  }, [selectionScopes?.active, selectionScopes?.available]);

  const onScopeChange = React.useCallback(
    (scopeId: string) => {
      setActiveScope({
        id: scopeId,
        def: getScopeById(scopeId, availableScopes),
      });
      // for backwards compatibility with Presentation frontend
      Presentation.selection.scopes.activeScope = scopeId;  // eslint-disable-line @typescript-eslint/no-deprecated
    },
    [availableScopes]
  );

  return {
    activeScope: activeScope,
    availableScopes,
    onScopeChange: selectionScopes?.onChange ?? onScopeChange,
  };
}

// the default scope is "element", so add it to available scopes map
const defaultAvailableScopes: SelectionScopesMap = {
  element: { label: "Element", def: "element" },
};

function getActiveScope(
  selectionScopes?: Pick<SelectionScopesProps, "active" | "available">
) {
  if (selectionScopes) {
    return {
      id: selectionScopes.active,
      def: getScopeById(selectionScopes.active, selectionScopes.available),
    };
  }
  return getActiveScopeFromPresentationFrontend();
}

function getScopeById(scopeId: string, availableScopes: SelectionScopesMap) {
  const scope = availableScopes[scopeId];
  if (!scope) {
    throw new Error(
      `Provided scope with id "${scopeId}" is not available in available scopes map. Available scopes: [${Object.keys(
        availableScopes
      ).join(", ")}]`
    );
  }
  return scope.def;
}

function getActiveScopeFromPresentationFrontend(): {
  id: string;
  def: SelectionScope;
} {
  const activeScope = Presentation.selection.scopes.activeScope;  // eslint-disable-line @typescript-eslint/no-deprecated
  if (!activeScope) {
    return { id: "element", def: "element" };
  }
  if (typeof activeScope === "string") {
    return {
      id: activeScope,
      def: convertPresentationFrontendScope(activeScope),
    };
  }
  const convertedScope = convertPresentationFrontendScope(activeScope.id);
  if (
    typeof convertedScope !== "string" ||
    convertedScope === "category" ||
    convertedScope === "model"
  ) {
    return { id: activeScope.id, def: convertedScope };
  }
  return {
    id: activeScope.id,
    def: {
      id: convertedScope,
      ancestorLevel:
        "ancestorLevel" in activeScope ? activeScope.ancestorLevel : undefined,
    },
  };
}

function convertPresentationFrontendScope(scope: string): SelectionScope {
  switch (scope) {
    case "assembly":
      return { id: "element", ancestorLevel: 1 };
    case "top-assembly":
      return { id: "element", ancestorLevel: -1 };
    case "functional-assembly":
      return { id: "functional", ancestorLevel: 1 };
    case "functional-top-assembly":
      return { id: "functional", ancestorLevel: -1 };
    case "functional-element":
      return "functional";
    case "element":
    case "category":
    case "model":
    case "functional":
      return scope;
    default:
      return "element";
  }
}
