/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

export class Auth {
  private static client: BrowserAuthorizationClient;

  public static initialize(options: BrowserAuthorizationClientConfiguration) {
    this.client = new BrowserAuthorizationClient(options);
    return this.client;
  }

  public static getClient() {
    if (!this.client) {
      throw new Error(
        "Client not initialized. Please call `Auth.initialize(BrowserAuthorizationClientConfiguration)`"
      );
    }
    return this.client;
  }

  public static async handleSigninCallback(): Promise<void> {
    const client = this.getClient();
    client.handleSigninCallback();
  }
}
