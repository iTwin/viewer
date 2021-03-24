/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UserManager } from "oidc-client";

class MockOidcClient {
  private _userManager: UserManager;

  constructor() {
    const userSettings = {
      scopes:
        "openid email profile organization imodelhub context-registry-service:read-only product-settings-service general-purpose-imodeljs-backend imodeljs-router",
      client_id: "imodeljs-spa-samples-2686",
      redirect_uri: "http://localhost:3000/signin-callback",
      post_logout_redirect_uri: "http://localhost:3000/logout",
      authority: "https://qa-imsoidc.bentley.com",
    };
    this._userManager = new UserManager(userSettings);
  }

  public getUserManager(): UserManager {
    return this._userManager;
  }
}

export default MockOidcClient;
