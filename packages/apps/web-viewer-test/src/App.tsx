/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";

import { AllRoutes } from "./components/routing";

function App() {
  return (
    <Suspense fallback={<></>}>
      <BrowserRouter>
        <AllRoutes />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
