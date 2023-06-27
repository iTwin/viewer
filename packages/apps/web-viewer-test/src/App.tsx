/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AllRoutes } from "./components/routing";

function App() {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<></>}>
        <BrowserRouter>
          <AllRoutes />
        </BrowserRouter>
      </React.Suspense>
    </React.StrictMode>
  );
}

export default App;
