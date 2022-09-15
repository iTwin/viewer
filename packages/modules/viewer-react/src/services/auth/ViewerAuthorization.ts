/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken, BeEvent } from "@itwin/core-bentley";
import type { AuthorizationClient } from "@itwin/core-common";

export interface ViewerAuthorizationClient extends AuthorizationClient {
  readonly onAccessTokenChanged: BeEvent<(token: AccessToken) => void>;
}

export class ViewerAuthorization {
  public static client?: ViewerAuthorizationClient;
}
