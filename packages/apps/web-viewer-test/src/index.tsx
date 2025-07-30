/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./index.scss";
import "@itwin/itwinui-react/styles.css";

import { ThemeProvider } from "@itwin/itwinui-react";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

globalThis.IMJS_URL_PREFIX = "";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
