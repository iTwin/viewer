/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BrowserAuthorizationClientConfiguration } from "@bentley/frontend-authorization-client";
import { Range3d } from "@bentley/geometry-core";
import { Cartographic, ColorDef, RenderMode } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { BlankViewer } from "@itwin/web-viewer-react";
import React, { useEffect, useState } from "react";

import { GeometryDecorator } from "../../decorators/GeometryDecorator";
import { TestUiProvider2 } from "../../providers";
import { Header } from "./";
import styles from "./Home.module.scss";

/**
 * Test blank connection viewer
 * @returns
 */
export const BlankConnectionHome: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(
    (IModelApp.authorizationClient?.hasSignedIn &&
      IModelApp.authorizationClient?.isAuthorized) ||
      false
  );

  const authConfig: BrowserAuthorizationClientConfiguration = {
    scope: process.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
    clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
    redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
    postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
    responseType: "code",
    authority: process.env.IMJS_AUTH_AUTHORITY,
  };

  useEffect(() => {
    setLoggedIn(
      IModelApp.authorizationClient
        ? IModelApp.authorizationClient.hasSignedIn &&
            IModelApp.authorizationClient.isAuthorized
        : false
    );
  }, []);

  const toggleLogin = async () => {
    if (!loggedIn) {
      await IModelApp.authorizationClient?.signIn();
    } else {
      await IModelApp.authorizationClient?.signOut();
    }
  };

  /**
   * This value is for the iTwin Viewer and will be the default if the productId prop is not provided.
   * This is merely an example on how to use the prop to override with your application's GPRID.
   */
  const productId = "3098";

  const iModelAppInit = () => {
    const decorator = new GeometryDecorator();
    IModelApp.viewManager.addDecorator(decorator);
    decorator.drawBase();
  };

  return (
    <div className={styles.home}>
      <Header handleLoginToggle={toggleLogin} loggedIn={loggedIn} />
      <BlankViewer
        authConfig={{ config: authConfig }}
        blankConnection={{
          name: "GeometryConnection",
          location: Cartographic.fromDegrees(0, 0, 0),
          extents: new Range3d(-30, -30, -30, 30, 30, 30),
        }}
        viewStateOptions={{
          displayStyle: { backgroundColor: ColorDef.white },
          viewFlags: { grid: true, renderMode: RenderMode.SmoothShade },
          setAllow3dManipulations: false,
        }}
        productId={productId}
        onIModelAppInit={iModelAppInit}
        uiProviders={[new TestUiProvider2()]}
      />
    </div>
  );
};
