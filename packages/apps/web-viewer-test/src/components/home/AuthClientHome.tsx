/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ColorTheme } from "@itwin/appui-react";
import { Viewer } from "@itwin/web-viewer-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { AuthorizationClient } from "../../services/auth";
import { Header } from "./";
import styles from "./Home.module.scss";

/**
 * Test a viewer that uses a browser authorization client
 * @returns
 */
export const AuthClientHome: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(
    (AuthorizationClient.oidcClient?.hasSignedIn &&
      AuthorizationClient.oidcClient?.isAuthorized) ||
      false
  );

  const [oidcInitialized, setOidcInitialized] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (!AuthorizationClient.oidcClient) {
      AuthorizationClient.initializeOidc()
        .then(() => {
          setOidcInitialized(true);
          setLoggedIn(
            (AuthorizationClient.oidcClient?.hasSignedIn &&
              AuthorizationClient.oidcClient?.isAuthorized) ||
              false
          );
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setOidcInitialized(true);
      setLoggedIn(
        (AuthorizationClient.oidcClient?.hasSignedIn &&
          AuthorizationClient.oidcClient?.isAuthorized) ||
          false
      );
    }
  }, []);

  const toggleLogin = async () => {
    if (!loggedIn) {
      await AuthorizationClient.signIn(location.pathname);
      setLoggedIn(
        AuthorizationClient.oidcClient?.hasSignedIn &&
          AuthorizationClient.oidcClient?.isAuthorized
      );
    } else {
      await AuthorizationClient.signOut(location.pathname);
    }
  };

  return (
    <div className={styles.home}>
      <Header handleLoginToggle={toggleLogin} loggedIn={loggedIn} />
      {oidcInitialized && (
        <Viewer
          authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
          iTwinId={process.env.IMJS_AUTH_CLIENT_CONTEXT_ID as string}
          iModelId={process.env.IMJS_AUTH_CLIENT_IMODEL_ID as string}
          appInsightsKey={process.env.IMJS_APPLICATION_INSIGHTS_KEY}
          theme={ColorTheme.Dark}
        />
      )}
    </div>
  );
};
