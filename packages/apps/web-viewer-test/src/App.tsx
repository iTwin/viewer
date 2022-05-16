/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Router } from "react-router-dom";

import { history, Routes } from "./components/routing";

function App() {
  return (
    <React.Suspense fallback={<></>}>
      <Router history={history}>
        <Routes />
      </Router>
    </React.Suspense>
  );
}

export default App;
