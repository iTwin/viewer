/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelConnection } from "@itwin/core-frontend";
import { SchemaContext } from "@itwin/ecschema-metadata";
import { ECSchemaRpcLocater } from "@itwin/ecschema-rpcinterface-common";
import { createStorage } from "@itwin/unified-selection";

const unifiedSelectionStorage = createStorage();

IModelConnection.onClose.addListener((imodel) => {
  unifiedSelectionStorage.clearStorage({ imodelKey: imodel.key });
});

const imodelSchemaContextsCache = new Map<string, SchemaContext>();

function getSchemaContext(imodel: IModelConnection) {
  let context = imodelSchemaContextsCache.get(imodel.key);
  if (!context) {
    context = new SchemaContext();
    context.addLocater(new ECSchemaRpcLocater(imodel.getRpcProps()));
    imodelSchemaContextsCache.set(imodel.key, context);
    imodel.onClose.addListener(() => {
      imodelSchemaContextsCache.delete(imodel.key);
    });
  }
  return context;
}

export { unifiedSelectionStorage, getSchemaContext };
