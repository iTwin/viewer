/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { type DesktopInitializerParams, useConnectivity , useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { IModelApp } from "@itwin/core-frontend";
import { initializeFrontendTiles } from "@itwin/frontend-tiles";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
import { Flex, Slider, Surface, Text, ThemeProvider, Tooltip } from "@itwin/itwinui-react";
import {
  MeasurementActionToolbar,
  MeasureTools,
} from "@itwin/measure-tools-react";
import { PropertyGridManager } from "@itwin/property-grid-react";
import { TreeWidget } from "@itwin/tree-widget-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";

import { viewerRpcs } from "../../common/ViewerConfig";
import { unifiedSelectionStorage } from "../../selectionStorage";
import { ITwinViewerApp } from "../app/ITwinViewerApp";
import { FrontendDevTools } from "@itwin/frontend-devtools";
import { SettingsContextProvider } from "../services/SettingsContext";
import { HomeRoute, IModelsRoute, ITwinsRoute, ViewerRoute } from "./routes";

const EdgeSliderWidget = () => {
  
  IModelApp.tileAdmin.defaultTileSizeModifier = 4;
  IModelApp.tileAdmin.movingDepthReduction = 5;

  const [maxDepth, setMaxDepth] = useState(() => IModelApp.tileAdmin?.deepestTileDepth);
  const [depth, setDepth] = useState(() => IModelApp.tileAdmin?.movingDepthReduction);
  const [tileSize, setTileSize] = useState(() => IModelApp.tileAdmin?.defaultTileSizeModifier);
  const [hovered, setHovered] = useState(false);

  return (
    <Tooltip content="Tree depth clamping" placement="right">
    <Surface
      elevation={4}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        left: 0,
        top: "50%",
        transform: `translateX(${hovered ? "0" : "calc(-100% + 10px)"}) translateY(-50%)`,
        transition: "transform 0.25s ease-in-out",
        zIndex: 9999,
        padding: "16px 12px",
        borderRadius: "0 8px 8px 0",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        gap: "8px",
        height: "500px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: "80px" }}>
      <Text variant="small" isMuted style={{ whiteSpace: "nowrap" }}>
        max depth
      </Text>
      <Slider
        orientation="vertical"
        min={0}
        max={maxDepth}
        values={[depth]}
        onChange={(values) => {
          setDepth(values[0]);
          IModelApp.tileAdmin.movingDepthReduction = values[0];
          setMaxDepth(IModelApp.tileAdmin.deepestTileDepth);
          console.log("Moving depth reduction set to", IModelApp.tileAdmin.movingDepthReduction);
        }}
        style={{ flex: 1, minHeight: 0 }}
      />
      <Text variant="small" isMuted>
        {depth}
      </Text>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: "80px" }}>
      <Text variant="small" isMuted style={{ whiteSpace: "nowrap" }}>
        tile size
      </Text>
      <Slider
        orientation="vertical"
        min={0}
        max={10}
        step={0.1}
        values={[tileSize]}
        onChange={(values) => {
          setTileSize(values[0]);
          IModelApp.tileAdmin.defaultTileSizeModifier = values[0];
          console.log("Tile size modifier set to", IModelApp.tileAdmin.defaultTileSizeModifier);
        }}
        style={{ flex: 1, minHeight: 0 }}
      />
      <Text variant="small" isMuted>
        {tileSize.toFixed(1)}
      </Text>
      </div>
    </Surface>
    </Tooltip>
  );
};

const App = () => {
  window.ITWIN_VIEWER_HOME = window.location.origin;

  const onIModelAppInit = useCallback(async () => {
    await FrontendDevTools.initialize();
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
    MeasurementActionToolbar.setDefaultActionProvider();
    console.log("Hello from onIModelAppInit!");
    initializeFrontendTiles({
          enableEdges: true,
          computeSpatialTilesetBaseUrl: async (_iModel) => {
            console.log("Hello from computeSpatialTilesetBaseUrl!");
            return new URL(`http://127.0.0.1:${import.meta.env.IMJS_TILES_SERVER_PORT ?? "6544"}/`);
          },
        });
  }, []);

  const desktopInitializerProps = useMemo<DesktopInitializerParams>(
    () => ({
      clientId: import.meta.env.IMJS_VIEWER_CLIENT_ID ?? "",
      rpcInterfaces: viewerRpcs,
      additionalI18nNamespaces: ["iTwinDesktopViewer"],
      enablePerformanceMonitors: true,
      selectionStorage: unifiedSelectionStorage,
      onIModelAppInit
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
      <EdgeSliderWidget />
      {initialized ? (
        <HashRouter>
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
        </HashRouter>
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
