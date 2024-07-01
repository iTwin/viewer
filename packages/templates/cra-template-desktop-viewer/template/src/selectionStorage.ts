/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelConnection } from "@itwin/core-frontend";
import { createStorage } from "@itwin/unified-selection";

const unifiedSelectionStorage = createStorage();

IModelConnection.onClose.addListener((imodel) => {
  unifiedSelectionStorage.clearStorage({ imodelKey: imodel.key });
});

export { unifiedSelectionStorage };
