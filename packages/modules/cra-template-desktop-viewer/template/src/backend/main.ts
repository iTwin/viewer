/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Logger, LogLevel } from "@bentley/bentleyjs-core";
import {
  ElectronHost,
  ElectronHostOptions,
} from "@bentley/electron-manager/lib/ElectronBackend";
import { Presentation } from "@bentley/presentation-backend";
import * as path from "path";

import { AppLoggerCategory } from "../common/LoggerCategory";
import { viewerRpcs } from "../common/ViewerConfig";
import { appInfo, getAppEnvVar } from "./AppInfo";
import ViewerHandler from "./ViewerHandler";

require("dotenv-flow").config(); // eslint-disable-line @typescript-eslint/no-var-requires

/** This is the function that gets called when we start iTwinViewer via `electron ViewerMain.js` from the command line.
 * It runs in the Electron main process and hosts the iModeljs backend (IModelHost) code. It starts the render (frontend) process
 * that starts from the file "index.ts". That launches the viewer frontend (IModelApp).
 */
const viewerMain = async () => {
  // Setup logging immediately to pick up any logging during IModelHost.startup()
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Warning);
  Logger.setLevel(AppLoggerCategory.Backend, LogLevel.Info);

  const clientId = getAppEnvVar("CLIENT_ID") ?? "";
  const scope = getAppEnvVar("SCOPE") ?? "";
  const redirectUri = getAppEnvVar("REDIRECT_URI");
  const issuerUrl = getAppEnvVar("ISSUER_URL");

  const electronHost: ElectronHostOptions = {
    webResourcesPath: path.join(__dirname, "..", "..", "build"),
    rpcInterfaces: viewerRpcs,
    developmentServer: process.env.NODE_ENV === "development",
    ipcHandlers: [ViewerHandler],
    authConfig: {
      clientId,
      scope,
      redirectUri: redirectUri || undefined,
      issuerUrl: issuerUrl || undefined,
    },
  };

  await ElectronHost.startup({ electronHost });

  Presentation.initialize();

  await ElectronHost.openMainWindow({
    width: 1280,
    height: 800,
    show: true,
    title: appInfo.title,
  });

  if (process.env.NODE_ENV === "development") {
    ElectronHost.mainWindow?.webContents.toggleDevTools();
  }
};

try {
  viewerMain(); // eslint-disable-line @typescript-eslint/no-floating-promises
} catch (error) {
  Logger.logError(AppLoggerCategory.Backend, error);
  process.exitCode = 1;
}
