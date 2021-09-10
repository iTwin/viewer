/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Home.scss";

import { Link, useNavigate } from "@reach/router";
import React from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";

const Home = () => {
  const navigate = useNavigate();

  const openSnapshot = async () => {
    const snapshotPath = await ITwinViewerApp.getSnapshotFile();
    if (snapshotPath) {
      void navigate("/snapshot", { state: { snapshotPath } });
    }
  };
  return (
    <div>
      <div className={"home-section-title"}>Start</div>
      <nav>
        <span onClick={openSnapshot}>
          {ITwinViewerApp.translate("openSnapshot")}
        </span>
        <Link to="itwins">{ITwinViewerApp.translate("viewRemoteIModel")}</Link>
      </nav>
    </div>
  );
};

export default Home;
