/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";

import type { ScreenViewport } from "@itwin/core-frontend";
import { FitViewTool, IModelApp, StandardViewId } from "@itwin/core-frontend";
import type { WebAuthorizationOptions } from "@itwin/web-viewer-react";
import { BaseInitializer, Viewer } from "@itwin/web-viewer-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Header } from "./Header";
import { history } from "./history";

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(
    (BaseInitializer.authClient?.hasSignedIn &&
      BaseInitializer.authClient?.isAuthorized) ||
      false
  );
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID);
  const [iTwinId, setITwinId] = useState(process.env.IMJS_ITWIN_ID);

  const authConfig = useMemo<WebAuthorizationOptions>(() => {
    return {
      config: {
        scope: process.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
        clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
        redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
        postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
        responseType: "code",
        authority: process.env.IMJS_AUTH_AUTHORITY,
      },
    };
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("iTwinId")) {
        setITwinId(urlParams.get("iTwinId") as string);
      } else {
        if (!process.env.IMJS_ITWIN_ID) {
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
    if (isAuthorized && iTwinId && iModelId) {
      history.push(`?iTwinId=${iTwinId}&iModelId=${iModelId}`);
    }
  }, [isAuthorized, iTwinId, iModelId]);

  useEffect(() => {
    if (isLoggingIn && isAuthorized) {
      setIsLoggingIn(false);
    }
  }, [isAuthorized, isLoggingIn]);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await BaseInitializer.authClient?.signIn();
  };

  const onLogoutClick = async () => {
    setIsLoggingIn(false);
    await BaseInitializer.authClient?.signOut();
    setIsAuthorized(false);
  };

  const onIModelAppInit = () => {
    setIsAuthorized(BaseInitializer.authClient?.isAuthorized ?? false);
    BaseInitializer.authClient?.onAccessTokenChanged.addListener(() => {
      setIsAuthorized(
        (BaseInitializer.authClient?.hasSignedIn &&
          BaseInitializer.authClient?.isAuthorized) ||
          false
      );
    });
  };

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    // default execute the fitview tool and use the iso standard view after tile trees are loaded
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
      void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  }, []);

  const viewCreatorOptions = useMemo(
    () => ({ viewportConfigurer: viewConfiguration }),
    [viewConfiguration]
  );

  return (
    <div className="viewer-container">
      <Header
        loggedIn={isAuthorized}
        handleLogin={onLoginClick}
        handleLogout={onLogoutClick}
      />
      {isLoggingIn ? (
        <span>"Logging in...."</span>
      ) : (
        <Viewer
          iTwinId={iTwinId}
          iModelId={iModelId}
          authConfig={authConfig}
          onIModelAppInit={onIModelAppInit}
          viewCreatorOptions={viewCreatorOptions}
        />
      )}
    </div>
  );
};

export default App;
