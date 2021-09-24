/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { Router } from "@reach/router";
import React from "react";

import {
  DownloadRoute,
  HomeRoute,
  IModelsRoute,
  ITwinsRoute,
  SnapshotRoute,
} from "./routes";

const App = () => {
  const initialized = useDesktopViewerInitializer();

  return initialized ? (
    <div style={{ height: "100%" }}>
      <Router style={{ height: "100%" }}>
        <HomeRoute path="/" />
        <DownloadRoute path="itwins/:iTwinId/:iModelId" />
        <IModelsRoute path="/itwins/:iTwinId" />
        <ITwinsRoute path="/itwins" />
        <SnapshotRoute path="/snapshot" />
      </Router>
    </div>
  ) : (
    <></>
  );
};

export default App;
