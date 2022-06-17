/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

import { AllRoutes, history } from "./components/routing";

function App() {
  return (
    <React.Suspense fallback={<></>}>
      <HistoryRouter history={history}>
        <AllRoutes />
      </HistoryRouter>
    </React.Suspense>
  );
}

export default App;
