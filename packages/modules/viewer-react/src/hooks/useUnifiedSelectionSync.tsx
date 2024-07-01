/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { SchemaContext } from "@itwin/ecschema-metadata";
import { ECSchemaRpcLocater } from "@itwin/ecschema-rpcinterface-common";
import { SelectionStorage, enableUnifiedSelectionSyncWithIModel } from "@itwin/unified-selection";
import { createCachingECClassHierarchyInspector } from "@itwin/presentation-shared";
import { createECSchemaProvider, createECSqlQueryExecutor } from "@itwin/presentation-core-interop";
import { IModelConnection } from "@itwin/core-frontend";
import { Presentation } from "@itwin/presentation-frontend";

type SelectionScope = ReturnType<Parameters<typeof enableUnifiedSelectionSyncWithIModel>[0]["activeScopeProvider"]>;

interface UseUnifiedSelectionSyncProps {
  iModelConnection?: IModelConnection;
  selectionStorage?: SelectionStorage;
}

export function useUnifiedSelectionSync({ iModelConnection, selectionStorage }: UseUnifiedSelectionSyncProps) {
  React.useEffect(() => {
    if (!iModelConnection || !selectionStorage) {
      return;
    }
    const schemaContext = new SchemaContext();
    schemaContext.addLocater(new ECSchemaRpcLocater(iModelConnection.getRpcProps()));
    return enableUnifiedSelectionSyncWithIModel({
      imodelAccess: {
        ...createECSqlQueryExecutor(iModelConnection),
        ...createCachingECClassHierarchyInspector({ schemaProvider: createECSchemaProvider(schemaContext) }),
        key: iModelConnection.key,
        hiliteSet: iModelConnection.hilited,
        selectionSet: iModelConnection.selectionSet,
      },
      selectionStorage,
      activeScopeProvider: getActiveScope,
    });
  }, [iModelConnection, selectionStorage]);
}

function getActiveScope(): SelectionScope {
  const activeScope = Presentation.selection.scopes.activeScope;
  if (!activeScope) {
    return "element";
  }
  if (typeof activeScope === "string") {
    return convertActiveScope(activeScope);
  }
  const convertedScope = convertActiveScope(activeScope.id);
  if (typeof convertedScope !== "string" || convertedScope === "category" || convertedScope === "model") {
    return convertedScope;
  }
  return {
    id: convertedScope,
    ancestorLevel: "ancestorLevel" in activeScope ? activeScope.ancestorLevel : undefined,
  }
}

function convertActiveScope(scope: string): SelectionScope {
  switch(scope) {
    case "assembly":
      return { id: "element", ancestorLevel: 1 }
    case "top-assembly":
      return { id: "element", ancestorLevel: -1 }
    case "functional-assembly":
      return { id: "functional", ancestorLevel: 1 }
    case "functional-top-assembly":
      return { id: "functional", ancestorLevel: -1 }
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