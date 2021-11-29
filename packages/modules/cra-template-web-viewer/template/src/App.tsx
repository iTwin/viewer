/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";

import {
  FitViewTool,
  IModelApp,
  ScreenViewport,
  StandardViewId,
} from "@itwin/core-frontend";
import { Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useState } from "react";

import { AuthorizationClient } from "./AuthClient";
import { Header } from "./Header";
import { history } from "./history";

const App: React.FC = () => {
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

  const [isAuthorized, setIsAuthorized] = useState(
    (AuthorizationClient.oidcClient?.hasSignedIn &&
      AuthorizationClient.oidcClient?.isAuthorized) ||
      false
  );
  const [oidcInitialized, setOidcInitialized] = useState(false);
  const [iTwinId, setContextId] = useState(process.env.IMJS_CONTEXT_ID);
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID);

  useEffect(() => {
    if (!AuthorizationClient.oidcClient) {
      AuthorizationClient.initializeOidc()
        .then(() => {
          setOidcInitialized(true);
          setIsAuthorized(
            (AuthorizationClient.oidcClient.hasSignedIn &&
              AuthorizationClient.oidcClient.isAuthorized) ||
              false
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setOidcInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("iTwinId")) {
        setContextId(urlParams.get("iTwinId") as string);
      } else {
        if (!process.env.IMJS_CONTEXT_ID) {
          throw new Error(
            "Please add a valid context ID in the .env file and restart the application or add it to the iTwinId query parameter in the url and refresh the page. See the README for more information."
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
    if (iTwinId && iModelId && isAuthorized) {
      history.push(`?iTwinId=${iTwinId}&iModelId=${iModelId}`);
    }
  }, [iTwinId, iModelId, isAuthorized]);

  const onLoginClick = async () => {
    await AuthorizationClient.signIn();
    setOidcInitialized(true);
  };

  const onLogoutClick = async () => {
    await AuthorizationClient.signOut();
    setOidcInitialized(false);
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
        loggedIn={isAuthorized}
        handleLogin={onLoginClick}
        handleLogout={onLogoutClick}
      />
      {oidcInitialized && (
        <Viewer
          iTwinId={iTwinId}
          iModelId={iModelId}
          authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
          viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
        />
      )}
    </div>
  );
};

export default App;
