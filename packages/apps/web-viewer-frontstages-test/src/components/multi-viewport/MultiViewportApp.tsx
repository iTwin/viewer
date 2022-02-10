/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ColorTheme } from "@itwin/appui-react";
import type { IModelConnection } from "@itwin/core-frontend";
import type { ViewerFrontstage } from "@itwin/web-viewer-react";
import { Viewer } from "@itwin/web-viewer-react";
import type { FunctionComponent } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { AuthorizationClient } from "../../services/auth";
import { ViewSetup } from "../../services/viewsetup/ViewSetup";
import { MultiViewportFrontstage } from "./MultiViewportFrontstageProvider";
import { MultiViewportWidgetProvider } from "./MultiViewportWidget";

const uiProviders = [new MultiViewportWidgetProvider()];

const MultiViewportApp: FunctionComponent = () => {
  const [frontStages, setFrontstages] = useState<ViewerFrontstage[]>([
    {
      provider: new MultiViewportFrontstage(),
      default: true,
      requiresIModelConnection: true,
    },
  ]);

  const _initialViewstate = useCallback(
    async (iModelConnection: IModelConnection) => {
      const viewState = await ViewSetup.getDefaultView(iModelConnection);

      setFrontstages(() => [
        { provider: new MultiViewportFrontstage(viewState), default: true },
      ]);
      return viewState;
    },
    []
  );

  const vpOptions = useMemo(
    () => ({ viewState: _initialViewstate }),
    [_initialViewstate]
  );

  const login = useCallback(async () => {
    try {
      await AuthorizationClient.oidcClient.signInSilent();
    } catch {
      await AuthorizationClient.oidcClient.signIn();
    }
  }, []);

  useEffect(() => {
    void login();
  }, [login]);

  const Loader = () => {
    return <div>Things are happening...</div>;
  };

  return (
    <div style={{ height: "100vh" }}>
      <Viewer
        authClient={AuthorizationClient.oidcClient}
        iTwinId={process.env.IMJS_AUTH_CLIENT_ITWIN_ID}
        iModelId={process.env.IMJS_AUTH_CLIENT_IMODEL_ID}
        appInsightsKey={process.env.IMJS_APPLICATION_INSIGHTS_KEY}
        theme={ColorTheme.Dark}
        loadingComponent={<Loader />}
        viewportOptions={vpOptions}
        frontstages={frontStages}
        mapLayerOptions={{
          BingMaps: {
            key: "key",
            value: process.env.IMJS_BING_MAPS_KEY ?? "",
          },
        }}
        uiProviders={uiProviders}
        enablePerformanceMonitors={true}
        defaultUiConfig={{
          hideTreeView: true,
          hidePropertyGrid: true,
        }}
      />
    </div>
  );
};

export default MultiViewportApp;
