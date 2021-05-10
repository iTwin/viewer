/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BeEvent } from "@bentley/bentleyjs-core";
import { FrontendAuthorizationClient } from "@bentley/frontend-authorization-client";
import { AccessToken } from "@bentley/itwin-client";
import { UserManager } from "oidc-client";

class AuthorizationClient implements FrontendAuthorizationClient {
  getUserManager: () => UserManager;
  /** Set to true if there's a current authorized user or client (in the case of agent applications).
   * Set to true if signed in and the access token has not expired, and false otherwise.
   */
  isAuthorized: boolean;
  /** Set to true if the user has signed in, but the token has expired and requires a refresh */
  hasExpired: boolean;
  /** Set to true if signed in - the accessToken may be active or may have expired and require a refresh */
  hasSignedIn: boolean;

  /** handle addUserLoaded event */
  private _onUserLoad = async () => {
    if (this.getUserManager()) {
      const user = await this.getUserManager().getUser();
      if (!user || user.expired) {
        this.isAuthorized = false;
        this.hasExpired = true;
      } else {
        this.isAuthorized = true;
        this.hasExpired = false;
        this.hasSignedIn = true;
      }
    }
  };

  /** Create an AccessToken instance for imodelJs based on the cached user.
   * Re-construct so that we can continue to rely on the user manager and the user that is stored in local storage */
  private _constructAccessToken = async (): Promise<AccessToken> => {
    if (this.getUserManager()) {
      const user = await this.getUserManager().getUser();
      if (user) {
        // build the AccessToken instance
        return AccessToken.fromTokenResponseJson(user, user.profile);
      }
    }
    // resolve an empty object so that authentication fails
    const emptyToken: any = {};
    return emptyToken;
  };

  /** initialize from existing user */
  private initialize = async () => {
    if (this.getUserManager()) {
      const user = await this.getUserManager().getUser();
      if (user) {
        this.hasExpired = user.expired;
        this.isAuthorized = !this.hasExpired;
      }
    }
  };

  constructor(_getUserManagerFunction: () => UserManager) {
    this.getUserManager = _getUserManagerFunction;
    // default
    this.isAuthorized = false;
    this.hasSignedIn = true;
    this.hasExpired = true;
    // initialize from user
    this.initialize().catch((error) => {
      throw error;
    });

    /** set properties from user manager events */
    if (this.getUserManager()) {
      this.getUserManager().events.addUserLoaded(() => {
        this._onUserLoad().catch((error) => {
          throw error;
        });
      });
      this.getUserManager().events.addUserUnloaded(() => {
        this.isAuthorized = false;
        this.hasSignedIn = false;
        this.hasExpired = false;
      });
      this.getUserManager().events.addAccessTokenExpiring(() => {
        console.warn("Access token expiring");
      });
      this.getUserManager().events.addAccessTokenExpired(() => {
        this.isAuthorized = false;
        this.hasExpired = true;
      });
      this.getUserManager().events.addUserSignedOut(() => {
        this.isAuthorized = false;
        this.hasSignedIn = false;
        this.hasExpired = true;
      });
      this.getUserManager().events.addSilentRenewError((error) => {
        console.warn("Silent renew failed");
        console.warn(error);
      });
    }
  }

  /** Returns a promise that resolves to the AccessToken of the currently authorized user*/
  getAccessToken = async (): Promise<AccessToken> => {
    // if not currently authorized, attempt a silent signin
    if (!this.isAuthorized || this.hasExpired) {
      await this.getUserManager().signinSilent();
    }
    return await this._constructAccessToken();
  };

  /**
   * required by FrontendAuthorizationClient
   */
  signIn = (): Promise<void> => {
    return Promise.resolve();
  };

  /**
   * required by FrontendAuthorizationClient
   */
  signOut = (): Promise<void> => {
    return Promise.resolve();
  };

  /**
   * required by FrontendAuthorizationClient
   */
  readonly onUserStateChanged = new BeEvent<
    (token: AccessToken | undefined) => void
  >();
}

export default AuthorizationClient;
