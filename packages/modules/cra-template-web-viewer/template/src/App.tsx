/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";

import { BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";
import {
  FitViewTool,
  IModelApp,
  ScreenViewport,
  StandardViewId,
} from "@itwin/core-frontend";
import { Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useState } from "react";

import { Header } from "./Header";
import { history } from "./history";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    (IModelApp.authorizationClient?.hasSignedIn &&
      IModelApp.authorizationClient?.isAuthorized) ||
      false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID);
  const [contextId, setContextId] = useState(process.env.IMJS_CONTEXT_ID);

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

  const authConfig: BrowserAuthorizationClientConfiguration = {
    scope: process.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
    clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
    redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
    postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
    responseType: "code",
    authority: process.env.IMJS_AUTH_AUTHORITY,
  };

  useEffect(() => {
    if (isAuthorized) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("contextId")) {
        setContextId(urlParams.get("contextId") as string);
      } else {
        if (!process.env.IMJS_CONTEXT_ID) {
          throw new Error(
            "Please add a valid context ID in the .env file and restart the application or add it to the contextId query parameter in the url and refresh the page. See the README for more information."
          );
        }
      }

      if (urlParams.has("iModelId")) {
        setIModelId(urlParams.get("iModelId") as string);
      } else {
        if (!process.env.IMJS_IMODEL_ID) {
          throw new Error(
            "Please add a valid iModel ID in the .env file and restart the application or add it to the iModelId query parameter in the url and refresh the page. See the README for more information."
          );
        }
      }
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (contextId && iModelId && isAuthorized) {
      history.push(`?contextId=${contextId}&iModelId=${iModelId}`);
    }
  }, [contextId, iModelId, isAuthorized]);

  useEffect(() => {
    if (isLoggingIn && isAuthorized) {
      setIsLoggingIn(false);
    }
  }, [isAuthorized, isLoggingIn]);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await IModelApp.authorizationClient?.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await IModelApp.authorizationClient?.signOut();
    setIsAuthorized(false);
  };

  const onIModelAppInit = () => {
    setIsAuthorized(IModelApp.authorizationClient?.isAuthorized || false);
    IModelApp.authorizationClient?.onUserStateChanged.addListener(() => {
      setIsAuthorized(
        (IModelApp.authorizationClient?.hasSignedIn &&
          IModelApp.authorizationClient?.isAuthorized) ||
          false
      );
    });
  };

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = (viewPort: ScreenViewport) => {
    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          // after 20 seconds, stop waiting and fit the view
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };

    tileTreesLoaded().finally(() => {
      IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  };

  return (
    <div className="viewer-container">
      <Header
        handleLogin={onLoginClick}
        loggedIn={isAuthorized}
        handleLogout={onLogoutClick}
      />
      {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : (
        <Viewer
          contextId={contextId}
          iModelId={iModelId}
          authConfig={{ config: authConfig }}
          onIModelAppInit={onIModelAppInit}
          viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
        />
      )}
    </div>
  );
};

export default App;
