/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { DesktopInitializerParams } from "@itwin/desktop-viewer-react";
import { useConnectivity } from "@itwin/desktop-viewer-react";
import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
import { Flex, ThemeProvider } from "@itwin/itwinui-react";
import {
  MeasurementActionToolbar,
  MeasureTools,
} from "@itwin/measure-tools-react";
import { PropertyGridManager } from "@itwin/property-grid-react";
import { TreeWidget } from "@itwin/tree-widget-react";
import { useCallback, useEffect, useMemo } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import { viewerRpcs } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";
import { SettingsContextProvider } from "../services/SettingsContext";
import { HomeRoute, IModelsRoute, ITwinsRoute, ViewerRoute } from "./routes";
import { unifiedSelectionStorage } from "../selectionStorage";

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
      clientId: import.meta.env.IMJS_VIEWER_CLIENT_ID ?? "",
      rpcInterfaces: viewerRpcs,
      additionalI18nNamespaces: ["iTwinDesktopViewer"],
      enablePerformanceMonitors: true,
      selectionStorage: unifiedSelectionStorage,
      onIModelAppInit,
    }),
    [onIModelAppInit]
  );

  const initialized = useDesktopViewerInitializer(desktopInitializerProps);
  const connectivityStatus = useConnectivity();

  useEffect(() => {
    if (initialized) {
      // setup connectivity events to let the backend know the status
      void ITwinViewerApp.ipcCall.setConnectivity(connectivityStatus);
    }
  }, [initialized, connectivityStatus]);

  return (
    <ThemeProvider theme="dark" style={{ height: "100%" }}>
      {initialized ? (
        <BrowserRouter>
          <SettingsContextProvider>
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
          </SettingsContextProvider>
        </BrowserRouter>
      ) : (
        <Flex justifyContent="center" style={{ height: "100%" }}>
          <SvgIModelLoader
            data-testid="loader-wrapper"
            style={{
              height: "64px",
              width: "64px",
            }}
          />
        </Flex>
      )}
    </ThemeProvider>
  );
};

export default App;
