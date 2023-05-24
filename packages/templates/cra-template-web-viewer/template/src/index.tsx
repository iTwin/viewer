/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { Auth } from "./Auth";
import * as serviceWorker from "./serviceWorker";

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

Auth.initialize({
  scope: process.env.IMJS_AUTH_CLIENT_SCOPES,
  clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID,
  redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI,
  postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
  responseType: "code",
  authority: process.env.IMJS_AUTH_AUTHORITY,
});

const redirectUrl = new URL(process.env.IMJS_AUTH_CLIENT_REDIRECT_URI);
if (redirectUrl.pathname === window.location.pathname) {
  Auth.handleSigninCallback().catch(console.error);
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
