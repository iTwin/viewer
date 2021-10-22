/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BrowserAuthorizationCallbackHandler,
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@itwin/browser-authorization";

import { RedirectKey } from "./";

export class AuthorizationClient {
  private static _oidcClient: BrowserAuthorizationClient;

  public static get oidcClient(): BrowserAuthorizationClient {
    return this._oidcClient;
  }

  public static async initializeOidc(): Promise<void> {
    if (this._oidcClient) {
      return;
    }

    const scope = process.env.IMJS_AUTH_CLIENT_SCOPES ?? "";
    const clientId = process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "";
    const redirectUri = process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "";
    const postSignoutRedirectUri = process.env.IMJS_AUTH_CLIENT_LOGOUT_URI;
    const authority = process.env.IMJS_AUTH_AUTHORITY;

    // authority is optional and will default to Production IMS
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

  public static async signIn(redirectPath?: string): Promise<void> {
    if (redirectPath) {
      sessionStorage.setItem(RedirectKey, redirectPath);
    }
    await this.oidcClient.signIn();
  }

  public static async signOut(redirectPath?: string): Promise<void> {
    if (redirectPath) {
      sessionStorage.setItem(RedirectKey, redirectPath);
    }
    await this.oidcClient.signOut();
  }
}
