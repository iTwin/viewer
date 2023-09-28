/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DesktopInitializerParams } from "@itwin/desktop-viewer-react";
import { useConnectivity } from "@itwin/desktop-viewer-react";
import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
import { ThemeProvider } from "@itwin/itwinui-react";
import {
  MeasurementActionToolbar,
  MeasureTools,
} from "@itwin/measure-tools-react";
import { PropertyGridManager } from "@itwin/property-grid-react";
import { TreeWidget } from "@itwin/tree-widget-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import type { ViewerFile, ViewerSettings } from "../../common/ViewerConfig";
import { viewerRpcs } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";
import {
  addRecent as addRecentClient,
  checkFileExists as checkFileExistsClient,
  getUserSettings,
  removeRecent as removeRecentClient,
  SettingsContext,
} from "../services/SettingsClient";
import { HomeRoute, IModelsRoute, ITwinsRoute, ViewerRoute } from "./routes";

const App = () => {
  window.ITWIN_VIEWER_HOME = window.location.origin;

  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
    MeasurementActionToolbar.setDefaultActionProvider();
  }, []);

  const desktopInitializerProps = useMemo<DesktopInitializerParams>(
    () => ({
      clientId: process.env.IMJS_VIEWER_CLIENT_ID ?? "",
      rpcInterfaces: viewerRpcs,
      additionalI18nNamespaces: ["iTwinDesktopViewer"],
      enablePerformanceMonitors: true,
      onIModelAppInit,
    }),
    [onIModelAppInit]
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

  const removeRecent = useCallback(async (file: ViewerFile) => {
    const updatedSettings = await removeRecentClient(file);
    setSettings(updatedSettings);
    return updatedSettings;
  }, []);

  const checkFileExists = useCallback(async (file: ViewerFile) => {
    return await checkFileExistsClient(file);
  }, []);

  return initialized && settings ? (
    <ThemeProvider theme="dark" style={{ height: "100%" }}>
      <SettingsContext.Provider
        value={{ settings, addRecent, removeRecent, checkFileExists }}
      >
        <BrowserRouter>
          <PageLayout>
            <Routes>
              <Route
                element={
                  <PageLayout.Content padded>
                    <Outlet />
                  </PageLayout.Content>
                }
              >
                <Route path="/" element={<HomeRoute />} />
                <Route path="/itwins/:iTwinId" element={<IModelsRoute />} />
                <Route path="/itwins" element={<ITwinsRoute />} />
              </Route>
              <Route
                element={
                  <PageLayout.Content>
                    <Outlet />
                  </PageLayout.Content>
                }
              >
                <Route path="/viewer" element={<ViewerRoute />} />
              </Route>
            </Routes>
          </PageLayout>
        </BrowserRouter>
      </SettingsContext.Provider>
    </ThemeProvider>
  ) : (
    <></>
  );
};

export default App;
