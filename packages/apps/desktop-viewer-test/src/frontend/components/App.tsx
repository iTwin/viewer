/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { Router } from "@reach/router";
import React, { useCallback, useEffect, useState } from "react";

import { ViewerSettings } from "../../common/ViewerConfig";
import {
  addRecent as addRecentClient,
  getUserSettings,
  SettingsContext,
} from "../services/SettingsClient";
import { HomeRoute, IModelsRoute, ITwinsRoute, ViewerRoute } from "./routes";

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
