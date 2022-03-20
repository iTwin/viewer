/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";

export interface UiConfiguration {
  statusBar: boolean;
  tools: any[]; // TODO
  widgets: any[]; // TODO
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
