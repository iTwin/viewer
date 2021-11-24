/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { NativeApp } from "@bentley/imodeljs-frontend";
import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { Router } from "@reach/router";
import React, { useCallback, useEffect, useState } from "react";

import { ViewerSettings } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";
import {
  addRecent as addRecentClient,
  getUserSettings,
  SettingsContext,
} from "../services/SettingsClient";
import { HomeRoute, IModelsRoute, ITwinsRoute, ViewerRoute } from "./routes";

const App = () => {
  const initialized = useDesktopViewerInitializer();
  const [settings, setSettings] = useState<ViewerSettings>();
  const [connectivityListener, setConnectivityListener] =
    useState<() => void>();

  useEffect(() => {
    if (initialized) {
      // setup connectivity events to let the backend know the status
      void NativeApp.checkInternetConnectivity().then((status) => {
        void ITwinViewerApp.ipcCall.setConnectivity(status);
        const listener = NativeApp.onInternetConnectivityChanged.addListener(
          (status) => {
            void ITwinViewerApp.ipcCall.setConnectivity(status);
          }
        );
        setConnectivityListener(listener);
      });
      void getUserSettings().then((userSettings) => {
        setSettings(userSettings);
      });
    }
    return () => {
      if (connectivityListener) {
        connectivityListener();
      }
    };
  }, [initialized]);

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
