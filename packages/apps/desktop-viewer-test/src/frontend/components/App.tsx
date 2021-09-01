/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { Link, Router } from "@reach/router";
import React from "react";

import { HomeRoute, IModelsRoute, ProjectsRoute, ViewerRoute } from "./routes";

const App = () => {
  const initialized = useDesktopViewerInitializer();
  return initialized ? (
    <div style={{ height: "100%" }}>
      <div style={{ height: "20px" }}>
        <Link to="">Home</Link>
      </div>
      <Router style={{ height: "calc(100% - 20px)" }}>
        <HomeRoute path="/" />
        <ViewerRoute path="projects/:projectId/:iModelId" />
        <IModelsRoute path="/projects/:projectId" />
        <ProjectsRoute path="/projects" />
      </Router>
    </div>
  ) : (
    <></>
  );
};

export default App;
