/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BrowserAuthorizationCallbackHandler,
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@itwin/browser-authorization";

class MockAuthorizationClient {
  private static _oidcClient: BrowserAuthorizationClient;

  public static get oidcClient(): BrowserAuthorizationClient {
    return this._oidcClient;
  }

  public static async initialize(): Promise<void> {
    const scope =
      "openid email profile organization imodelhub context-registry-service:read-only product-settings-service general-purpose-imodeljs-backend imodeljs-router";
    const clientId = "imodeljs-spa-samples-2686";
    const redirectUri = "http://localhost:3000/signin-callback";
    const postSignoutRedirectUri = "http://localhost:3000/logout";
    const authority = "https://qa-imsoidc.bentley.com";

    const oidcConfiguration: BrowserAuthorizationClientConfiguration = {
      clientId,
      redirectUri,
      postSignoutRedirectUri,
      scope,
      responseType: "code",
      authority,
    };
    await BrowserAuthorizationCallbackHandler.handleSigninCallback(
      oidcConfiguration.redirectUri
    );
    this._oidcClient = new BrowserAuthorizationClient(oidcConfiguration);
  }

  public static async signIn(): Promise<void> {
    await this.oidcClient.signIn();
  }

  public static async signOut(): Promise<void> {
    await this.oidcClient.signOut();
  }
}

export default MockAuthorizationClient;
