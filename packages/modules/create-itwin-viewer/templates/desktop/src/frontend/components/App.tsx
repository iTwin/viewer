/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DesktopInitializerParams } from "@itwin/desktop-viewer-react";
import { useConnectivity } from "@itwin/desktop-viewer-react";
import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { Router } from "@reach/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import type { ViewerSettings } from "../../types";
import { ITwinViewerApp } from "../app/ITwinViewerApp";
import {
  addRecent as addRecentClient,
  getUserSettings,
  SettingsContext,
} from "../services/SettingsClient";
import { HomeRoute, IModelsRoute, ITwinsRoute, ViewerRoute } from "./routes";

const App = () => {
  (window as any).ITWIN_VIEWER_HOME = window.location.origin;

  const desktopInitializerProps = useMemo<DesktopInitializerParams>(
    () => ({
      additionalI18nNamespaces: ["iTwinDesktopViewer"],
      enablePerformanceMonitors: true,
    }),
    []
  );

  const initialized = useDesktopViewerInitializer(desktopInitializerProps);
  const connectivityStatus = useConnectivity();

  const [settings, setSettings] = useState<ViewerSettings>();

  useEffect(() => {
    if (initialized) {
      // setup connectivity events to let the backend know the status
      void ITwinViewerApp.ipcCall.setConnectivity(connectivityStatus);
      void getUserSettings().then((userSettings) => {
        setSettings(userSettings);
      });
    }
  }, [initialized, connectivityStatus]);

  const addRecent = useCallback(
    async (
      path: string,
      iModelName?: string,
      iTwinId?: string,
      iModelId?: string
    ) => {
      const updatedSettings = await addRecentClient(
        path,
        iModelName,
        iTwinId,
        iModelId
      );
      setSettings(updatedSettings);
      return updatedSettings;
    },
    []
  );

  return initialized && settings ? (
    <SettingsContext.Provider value={{ settings, addRecent }}>
      <div style={{ height: "100%" }}>
        <Router style={{ height: "100%" }}>
          <HomeRoute path="/" />
          <IModelsRoute path="/itwins/:iTwinId" />
          <ITwinsRoute path="/itwins" />
          <ViewerRoute path="/viewer" />
        </Router>
      </div>
    </SettingsContext.Provider>
  ) : (
    <></>
  );
};

export default App;
