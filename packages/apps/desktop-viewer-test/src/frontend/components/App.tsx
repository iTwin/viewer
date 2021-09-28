/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { Router } from "@reach/router";
import React, { useCallback, useEffect, useState } from "react";

import { ViewerSettings } from "../../common/ViewerConfig";
import {
  addRecentOnline as addRecentOnlineClient,
  addRecentSnapshot as addRecentSnapshotClient,
  getUserSettings,
  SettingsContext,
} from "../services/SettingsClient";
import {
  DownloadRoute,
  HomeRoute,
  IModelsRoute,
  ITwinsRoute,
  SnapshotRoute,
} from "./routes";

const App = () => {
  const initialized = useDesktopViewerInitializer();
  const [settings, setSettings] = useState<ViewerSettings>();

  useEffect(() => {
    if (initialized) {
      void getUserSettings().then((userSettings) => {
        setSettings(userSettings);
      });
    }
  }, [initialized]);

  const addRecentSnapshot = useCallback(async (path: string) => {
    const updatedSettings = await addRecentSnapshotClient(path);
    setSettings(updatedSettings);
    return updatedSettings;
  }, []);

  const addRecentOnline = useCallback(
    async (iTwinId: string, iModelId: string, iModelName?: string) => {
      const updatedSettings = await addRecentOnlineClient(
        iTwinId,
        iModelId,
        iModelName
      );
      setSettings(updatedSettings);
      return updatedSettings;
    },
    []
  );

  return initialized && settings ? (
    <SettingsContext.Provider
      value={{ settings, addRecentOnline, addRecentSnapshot }}
    >
      <div style={{ height: "100%" }}>
        <Router style={{ height: "100%" }}>
          <HomeRoute path="/" />
          <DownloadRoute path="itwins/:iTwinId/:iModelId" />
          <IModelsRoute path="/itwins/:iTwinId" />
          <ITwinsRoute path="/itwins" />
          <SnapshotRoute path="/snapshot" />
        </Router>
      </div>
    </SettingsContext.Provider>
  ) : (
    <></>
  );
};

export default App;
