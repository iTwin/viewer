/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { BeEvent } from "@itwin/core-bentley";
import type { ViewerAuthorizationClient } from "@itwin/viewer-react";

class MockAuthorizationClient implements ViewerAuthorizationClient {
  getAccessToken(): Promise<string> {
    return Promise.resolve("Bearer token");
  }

  readonly onAccessTokenChanged = new BeEvent<(token: AccessToken) => void>();
}

export default MockAuthorizationClient;
