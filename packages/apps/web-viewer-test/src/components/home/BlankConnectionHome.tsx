/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import { Cartographic, ColorDef, RenderMode } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { Range3d } from "@itwin/core-geometry";
import { ITwinLocalization } from "@itwin/core-i18n";
import { RealityDataAccessClient } from "@itwin/reality-data-client";
import { Viewer } from "@itwin/web-viewer-react";
import { useCallback, useEffect, useMemo } from "react";

import { GeometryDecorator } from "../../decorators/GeometryDecorator";
import { TestUiProvider2 } from "../../providers";

/**
 * Test blank connection viewer
 * @returns
 */
const BlankConnectionHome: React.FC = () => {
  const localization = useMemo(() => new ITwinLocalization(), []);
  const authClient = useMemo(
    () =>
      new BrowserAuthorizationClient({
        scope: import.meta.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
        clientId: import.meta.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
        redirectUri: import.meta.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
        postSignoutRedirectUri: import.meta.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
        responseType: "code",
      }),
    []
  );

  const realityDataAccessClient = useMemo(
    () =>
      new RealityDataAccessClient({
        baseUrl: `https://${globalThis.IMJS_URL_PREFIX}api.bentley.com/realitydata`,
        authorizationClient: authClient,
      }),
    [authClient]
  );

  const login = useCallback(async () => {
    try {
      await authClient.signInSilent();
    } catch {
      await authClient.signIn();
    }
  }, [authClient]);

  useEffect(() => {
    void login();
  }, [login]);

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
    <div style={{ height: "100vh" }}>
      <Viewer
        authClient={authClient}
        productId={productId}
        onIModelAppInit={iModelAppInit}
        uiProviders={[new TestUiProvider2()]}
        enablePerformanceMonitors={true}
        location={Cartographic.fromDegrees({
          longitude: 0,
          latitude: 0,
          height: 0,
        })}
        blankConnectionViewState={{
          displayStyle: { backgroundColor: ColorDef.white },
          viewFlags: { grid: true, renderMode: RenderMode.SmoothShade },
          setAllow3dManipulations: false,
        }}
        extents={new Range3d(-30, -30, -30, 30, 30, 30)}
        localization={localization}
        realityDataAccess={realityDataAccessClient}
      />
    </div>
  );
};

export default BlankConnectionHome;
