/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./index.scss";

import { Logger, LogLevel } from "@bentley/bentleyjs-core";
import React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { AppLoggerCategory } from "../common/LoggerCategory";
import store from "./app/store";
import { AppComponent } from "./components/AppComponent";

const viewerFrontendMain = async () => {
  // Setup logging immediately to pick up any logging during App.startup()
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Warning);
  Logger.setLevel(AppLoggerCategory.Frontend, LogLevel.Info);

  // when initialization is complete, render
  ReactDOM.render(
    <Provider store={store}>
      <AppComponent />
    </Provider>,
    document.getElementById("root")
  );
};

viewerFrontendMain(); // eslint-disable-line @typescript-eslint/no-floating-promises
