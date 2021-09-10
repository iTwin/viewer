/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";

import {
  BrowserAuthorizationCallbackHandler,
  BrowserAuthorizationClient,
  FrontendAuthorizationClient,
} from "@bentley/frontend-authorization-client";
import { FrontendRequestContext } from "@bentley/imodeljs-frontend";
import React from "react";

import AuthorizationOptions from "./AuthorizationOptions";
import View from "./View";

const App: React.FC = () => {
  /** Ensure client variables exist. */
  if (!process.env.IMJS_AUTH_CLIENT_CLIENT_ID) {
    throw new Error(
      "Please add a valid OIDC client id to the .env file and restart the application. See the README for more information."
    );
  }
  if (!process.env.IMJS_AUTH_CLIENT_SCOPES) {
    throw new Error(
      "Please add valid scopes for your OIDC client to the .env file and restart the application. See the README for more information."
    );
  }
  if (!process.env.IMJS_AUTH_CLIENT_REDIRECT_URI) {
    throw new Error(
      "Please add a valid redirect URI to the .env file and restart the application. See the README for more information."
    );
  }

  /** Set ContextId and IModelId in session storage for the Viewer to retrieve. */
  sessionStorage.setItem("IMJS_CONTEXT_ID", process.env.IMJS_CONTEXT_ID ?? "");
  sessionStorage.setItem("IMJS_IMODEL_ID", process.env.IMJS_IMODEL_ID ?? "");

  /** Creation of a client */
  let client: FrontendAuthorizationClient;
  if (AuthorizationOptions.config) {
    client = new BrowserAuthorizationClient(AuthorizationOptions.config);
  } else if (AuthorizationOptions.oidcClient) {
    client = AuthorizationOptions.oidcClient;
  } else {
    throw new Error("Please provide a valid AuthOptions file.");
  }

  /** Ask the user to sign in if there is no OIDC token currently in the browser and the Redirect URL. */
  BrowserAuthorizationCallbackHandler.handleSigninCallback(
    process.env.IMJS_AUTH_CLIENT_REDIRECT_URI
  ).then(() => {
    client.signIn(new FrontendRequestContext());
  });

  return (
    <div className="viewer-container">
      <View />
    </div>
  );
};

export default App;
