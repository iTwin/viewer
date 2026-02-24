/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

BrowserAuthorizationClient.handleSignInCallback().catch(() => window.close());
