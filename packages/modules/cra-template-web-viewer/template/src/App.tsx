import "./App.scss";

import {
  BrowserAuthorizationCallbackHandler,
  BrowserAuthorizationClient,
  FrontendAuthorizationClient,
} from "@bentley/frontend-authorization-client";
import { FrontendRequestContext } from "@bentley/imodeljs-frontend";
import React, { useContext, useEffect, useState } from "react";

import { browserhistory } from "./browserhistory";
import ViewerContext from "./ViewerContext";
import ViewerStartup from "./ViewerStartup";

const App: React.FC = () => {
  const { contextId, iModelId, authOptions } = useContext(ViewerContext);
  const [currContextId, setCurrContextId] = useState(contextId);
  const [currIModelId, setCurrIModelId] = useState(iModelId);

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
  if (
    urlParams.has("contextId") &&
    urlParams.get("contextId") !== currContextId
  ) {
    setCurrContextId(urlParams.get("contextId") as string);
  } else if (!process.env.IMJS_CONTEXT_ID) {
    throw new Error(
      "Please add a valid context ID in the .env file and restart the application or add it to the contextId query parameter in the url and refresh the page. See the README for more information."
    );
  }

  if (urlParams.has("iModelId") && urlParams.get("iModelId") !== currIModelId) {
    setCurrIModelId(urlParams.get("iModelId") as string);
  } else if (!process.env.IMJS_IMODEL_ID) {
    throw new Error(
      "Please add a valid iModel ID in the .env file and restart the application or add it to the iModelId query parameter in the url and refresh the page. See the README for more information."
    );
  }

  /** Creation of a client */
  let client: FrontendAuthorizationClient;
  if (authOptions.config) {
    client = new BrowserAuthorizationClient(authOptions.config);
  } else if (authOptions.oidcClient) {
    client = authOptions.oidcClient;
  } else {
    throw new Error("Please provide a valid AuthOptions file.");
  }

  /** Handle the callback, otherwise just signin. */
  BrowserAuthorizationCallbackHandler.handleSigninCallback(
    process.env.IMJS_AUTH_CLIENT_REDIRECT_URI
  ).then(() => {
    client.signIn(new FrontendRequestContext());
  });

  useEffect(() => {
    browserhistory.push(`?contextId=${currContextId}&iModelId=${currIModelId}`);
  }, [currContextId, currIModelId]);

  return (
    <ViewerContext.Provider
      value={{ contextId: currContextId, iModelId: currIModelId, authOptions }}
    >
      <div className="viewer-container">
        <ViewerStartup />
      </div>
    </ViewerContext.Provider>
  );
};

export default App;
