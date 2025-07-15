/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { createStorage } from "@itwin/unified-selection";
import { IModelConnection } from "@itwin/core-frontend";

export const selectionStorage = createStorage();

IModelConnection.onClose.addListener((imodel) => {
  selectionStorage.clearStorage({ imodelKey: imodel.key });
});
