/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import type { ElectronRendererAuthorization } from "@itwin/electron-authorization/lib/cjs/ElectronRenderer";

import type { ViewerOidcClient } from "./ViewerOidcClient";

type ViewerAuthClient =
  | BrowserAuthorizationClient
  | ViewerOidcClient
  | ElectronRendererAuthorization
  | undefined;

export class ViewerAuthorization {
  private static _client: ViewerAuthClient;

  /**
   * Return the stored auth client
   */
  public static get client(): ViewerAuthClient {
    return this._client;
  }

  /**
   * Set the stored auth client
   */
  public static set client(client: ViewerAuthClient) {
    this._client = client;
  }
}
