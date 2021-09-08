/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Home.scss";

import { Link } from "@reach/router";
import React from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";

const Home = () => {
  return (
    <nav>
      <Link to="viewer">{ITwinViewerApp.translate("openLocalBriefcase")}</Link>
      <Link to="viewer">{ITwinViewerApp.translate("openSnapshot")}</Link>
      <Link to="projects">{ITwinViewerApp.translate("downloadBriefcase")}</Link>
    </nav>
  );
};

export default Home;
