/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Logger, LogLevel } from "@bentley/bentleyjs-core";
import {
  ElectronHost,
  ElectronHostOptions,
} from "@bentley/electron-manager/lib/ElectronBackend";
import { IpcHost } from "@bentley/imodeljs-backend";
import { Presentation } from "@bentley/presentation-backend";
import { Menu } from "electron";
import { MenuItemConstructorOptions } from "electron/main";
import * as path from "path";

import { AppLoggerCategory } from "../common/LoggerCategory";
import { channelName, viewerRpcs } from "../common/ViewerConfig";
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
      redirectUri: redirectUri || undefined, // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
      issuerUrl: issuerUrl || undefined, // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    },
    iconName: "itwin-viewer.ico",
  };

  await ElectronHost.startup({ electronHost });

  Presentation.initialize();

  await ElectronHost.openMainWindow({
    width: 1280,
    height: 800,
    show: true,
    title: appInfo.title,
    autoHideMenuBar: false,
  });

  if (process.env.NODE_ENV === "development") {
    ElectronHost.mainWindow?.webContents.toggleDevTools();
  }
  // add the menu
  ElectronHost.mainWindow?.on("ready-to-show", createMenu);
};

const createMenu = () => {
  const isMac = process.platform === "darwin";

  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "Open snapshot file",
          click: () => {
            IpcHost.send(channelName, "snapshot");
          },
        },
        {
          label: "View remote iModel",
          click: () => {
            IpcHost.send(channelName, "remote");
          },
        },
        { type: "separator" },
        isMac
          ? { label: "Close", role: "close" }
          : { label: "Close", role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Getting started",
          click: () => {
            IpcHost.send(channelName, "home");
          },
        },
      ],
    },
  ] as MenuItemConstructorOptions[];

  if (isMac) {
    template.push({
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          role: "minimize",
        },
        {
          label: "Zoom",
          role: "zoom",
        },
      ],
    });
    template.unshift({
      label: "iTwin Viewer",
      role: "appMenu",
      submenu: [
        {
          label: "Preferences",
          click: () => {
            IpcHost.send(channelName, "preferences");
          },
        },
      ],
    } as MenuItemConstructorOptions);
  }

  const menu = Menu.buildFromTemplate(template as MenuItemConstructorOptions[]);

  Menu.setApplicationMenu(menu);
  ElectronHost.mainWindow?.setMenuBarVisibility(true);
  // this is overridden in ElectronHost and set to true so it needs to be...re-overriden??
  ElectronHost.mainWindow?.setAutoHideMenuBar(false);
};

try {
  void viewerMain();
} catch (error) {
  Logger.logError(AppLoggerCategory.Backend, error);
  process.exitCode = 1;
}
