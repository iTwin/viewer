/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UiFramework } from "@bentley/ui-framework";

export class SelectionScopeClient {
  public static readonly defaultScope = "top-assembly";
  public static async initializeSelectionScope(): Promise<void> {
    UiFramework.setActiveSelectionScope(SelectionScopeClient.defaultScope);
  }
}
