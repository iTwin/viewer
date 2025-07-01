/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IModelConnection } from "@itwin/core-frontend";
import {
  createECSchemaProvider,
  createECSqlQueryExecutor,
} from "@itwin/presentation-core-interop";
import { createCachingECClassHierarchyInspector } from "@itwin/presentation-shared";
import {
  enableUnifiedSelectionSyncWithIModel,
  SelectionStorage,
} from "@itwin/unified-selection";
import React from "react";

type SelectionScope = ReturnType<
  Parameters<
    typeof enableUnifiedSelectionSyncWithIModel
  >[0]["activeScopeProvider"]
>;

interface UseUnifiedSelectionSyncProps {
  iModelConnection?: IModelConnection;
  selectionStorage: SelectionStorage;
  activeSelectionScope: SelectionScope;
}

/** @internal */
export function useUnifiedSelectionSync({
  iModelConnection,
  selectionStorage,
  activeSelectionScope,
}: UseUnifiedSelectionSyncProps) {
  const activeScope = React.useRef<SelectionScope>(activeSelectionScope);
  React.useEffect(() => {
    activeScope.current = activeSelectionScope;
  }, [activeSelectionScope]);

  React.useEffect(() => {
    if (!iModelConnection) {
      return;
    }
    const { schemaContext } = iModelConnection;
    return enableUnifiedSelectionSyncWithIModel({
      imodelAccess: {
        ...createECSqlQueryExecutor(iModelConnection),
        ...createCachingECClassHierarchyInspector({
          schemaProvider: createECSchemaProvider(schemaContext),
        }),
        key: iModelConnection.key,
        hiliteSet: iModelConnection.hilited,
        selectionSet: iModelConnection.selectionSet,
      },
      selectionStorage,
      activeScopeProvider: () => activeScope.current,
    });
  }, [iModelConnection, selectionStorage]);
}
