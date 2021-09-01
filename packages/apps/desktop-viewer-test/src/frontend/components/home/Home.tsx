/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./Home.scss";

import { Link } from "@reach/router";
import React from "react";

// TODO Kevin localize strings

const Home = () => {
  return (
    <nav>
      <Link to="viewer">Open Snapshot File</Link>
      <Link to="viewer">Open Local Briefcase</Link>
      <Link to="projects">Download Briefcase</Link>
    </nav>
  );
};

export default Home;
