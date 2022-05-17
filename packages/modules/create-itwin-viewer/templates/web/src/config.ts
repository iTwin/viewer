/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { UiItemsProvider } from "@itwin/appui-abstract";
import type { BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";

export interface ExtensionProvider {
  provider: UiItemsProvider;
  initFn?: () => Promise<void>;
}

export interface UiConfiguration {
  statusBar: boolean;
}

export interface AppConfiguration {
  auth: BrowserAuthorizationClientConfiguration;
  iTwinId?: string;
  iModelId?: string;
}

// UI Configuration
// UI CONFIG HERE

// App Configuration
// APP CONFIG HERE
