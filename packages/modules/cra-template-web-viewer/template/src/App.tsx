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
import { history } from "./history";
import ViewerStartup from "./ViewerStartup";

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

  /** Grab the ContextId and IModelId from the URL parameters first, else the .ENV variables */
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("contextId")) {
    sessionStorage.setItem(
      "IMJS_CONTEXT_ID",
      urlParams.get("contextId") as string
    );
  } else {
    if (process.env.IMJS_CONTEXT_ID) {
      sessionStorage.setItem("IMJS_CONTEXT_ID", process.env.IMJS_CONTEXT_ID);
    } else {
      throw new Error(
        "Please add a valid context ID in the .env file and restart the application or add it to the contextId query parameter in the url and refresh the page. See the README for more information."
      );
    }
  }

  if (urlParams.has("iModelId")) {
    sessionStorage.setItem(
      "IMJS_IMODEL_ID",
      urlParams.get("iModelId") as string
    );
  } else {
    if (process.env.IMJS_IMODEL_ID) {
      sessionStorage.setItem("IMJS_IMODEL_ID", process.env.IMJS_IMODEL_ID);
    } else {
      throw new Error(
        "Please add a valid iModel ID in the .env file and restart the application or add it to the iModelId query parameter in the url and refresh the page. See the README for more information."
      );
    }
  }

  /** Creation of a client */
  let client: FrontendAuthorizationClient;
  if (AuthorizationOptions.config) {
    client = new BrowserAuthorizationClient(AuthorizationOptions.config);
  } else if (AuthorizationOptions.oidcClient) {
    client = AuthorizationOptions.oidcClient;
  } else {
    throw new Error("Please provide a valid AuthOptions file.");
  }

  /** Handle the callback, otherwise just signin. */
  BrowserAuthorizationCallbackHandler.handleSigninCallback(
    process.env.IMJS_AUTH_CLIENT_REDIRECT_URI
  ).then(() => {
    client.signIn(new FrontendRequestContext());
    history.push(
      `?contextId=${sessionStorage.getItem(
        "IMJS_CONTEXT_ID"
      )}&iModelId=${sessionStorage.getItem("IMJS_IMODEL_ID")}`
    );
  });

  return (
    <div className="viewer-container">
      <ViewerStartup />
    </div>
  );
};

export default App;
