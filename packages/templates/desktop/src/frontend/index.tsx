/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./index.scss";
import "@itwin/itwinui-layouts-css/styles.css";

import { Logger, LogLevel } from "@itwin/core-bentley";
import { createRoot } from "react-dom/client";

import { AppLoggerCategory } from "../common/LoggerCategory";
import App from "./components/App";

const viewerFrontendMain = async () => {
  // Setup logging immediately to pick up any logging during App.startup()
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Trace);
  Logger.setLevel(AppLoggerCategory.Frontend, LogLevel.Info);

  // when initialization is complete, render
  const container = document.getElementById("root") as HTMLElement;
  const root = createRoot(container);

  document.documentElement.classList.add(`iui-theme-dark`);

  root.render(<App />);
};

viewerFrontendMain(); // eslint-disable-line @typescript-eslint/no-floating-promises
