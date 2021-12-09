/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ColorTheme } from "@itwin/appui-react";
import type { BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";
import type { ScreenViewport } from "@itwin/core-frontend";
import { FitViewTool, IModelApp, StandardViewId } from "@itwin/core-frontend";
import type { IModelBackendOptions } from "@itwin/web-viewer-react";
import { BaseInitializer, Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useState } from "react";

import { IModelBankFrontend } from "../../services/IModelBankFrontendHubAccess";
import { history } from "../routing";
import { Header } from ".";
import styles from "./Home.module.scss";

/**
 * Test a viewer that is connected to an iModelBank
 * @returns
 */
export const IModelBankHome: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(
    (BaseInitializer.authClient?.hasSignedIn &&
      BaseInitializer.authClient?.isAuthorized) ||
      false
  );
  const [iModelId, setIModelId] = useState(
    process.env.IMJS_AUTH_CLIENT_IMODEL_ID
  );
  const [iTwinId, setITwinId] = useState(process.env.IMJS_AUTH_CLIENT_ITWIN_ID);

  const authConfig: BrowserAuthorizationClientConfiguration = {
    scope: process.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
    clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
    redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
    postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
    responseType: "code",
    authority: process.env.IMJS_AUTH_AUTHORITY,
  };

  const backend: IModelBackendOptions = {
    customBackend: {
      rpcParams: {
        info: { title: "sample-backend", version: "1.0" },
        uriPrefix: "https://dev-imodelbank.bentley.com/imodeljs",
      },
    },
  };

  const imodelBankClient = new IModelBankFrontend(
    "https://dev-imodelbank.bentley.com"
  );

  useEffect(() => {
    setLoggedIn(
      (BaseInitializer.authClient?.hasSignedIn &&
        BaseInitializer.authClient?.isAuthorized) ||
        false
    );
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iTwinId")) {
      setITwinId(urlParams.get("iTwinId") as string);
    }

    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    }
  }, []);

  useEffect(() => {
    history.push(`imodelbank?iTwinId=${iTwinId}&iModelId=${iModelId}`);
  }, [iTwinId, iModelId]);

  const toggleLogin = async () => {
    if (!loggedIn) {
      await BaseInitializer.authClient?.signIn();
    } else {
      await BaseInitializer.authClient?.signOut();
    }
  };

  const onIModelAppInit = () => {
    setLoggedIn(BaseInitializer.authClient?.isAuthorized ?? false);
    BaseInitializer.authClient?.onAccessTokenChanged.addListener(() => {
      setLoggedIn(
        (BaseInitializer.authClient?.hasSignedIn &&
          BaseInitializer.authClient?.isAuthorized) ||
          false
      );
    });
  };

  const switchModel = () => {
    if (iModelId === (process.env.IMJS_AUTH_CLIENT_IMODEL_ID as string)) {
      setIModelId(process.env.IMJS_AUTH_CLIENT_IMODEL_ID2 as string);
    } else {
      setIModelId(process.env.IMJS_AUTH_CLIENT_IMODEL_ID as string);
    }
  };

  const viewConfiguration = (viewPort: ScreenViewport) => {
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
  };

  return (
    <div className={styles.home}>
      <Header
        handleLoginToggle={toggleLogin}
        loggedIn={loggedIn}
        switchModel={switchModel}
      />
      <Viewer
        authConfig={{ config: authConfig }}
        iTwinId={iTwinId}
        iModelId={iModelId}
        appInsightsKey={process.env.IMJS_APPLICATION_INSIGHTS_KEY}
        theme={ColorTheme.Dark}
        onIModelAppInit={onIModelAppInit}
        viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
        backend={backend}
        hubAccess={imodelBankClient}
      />
    </div>
  );
};
