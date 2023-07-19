/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./index.scss";

import { UiFramework } from "@itwin/appui-react";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

globalThis.IMJS_URL_PREFIX = process.env.IMJS_URL_PREFIX || "";

const container = document.getElementById("root");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
UiFramework.childWindows.useCreateRoot(createRoot);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
