/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelHostConfiguration, IpcHost } from "@itwin/core-backend";
import { Logger, LogLevel } from "@itwin/core-bentley";
import type { ElectronHostOptions } from "@itwin/core-electron/lib/cjs/ElectronBackend";
import { ElectronHost } from "@itwin/core-electron/lib/cjs/ElectronBackend";
import { BackendIModelsAccess } from "@itwin/imodels-access-backend";
import { Presentation } from "@itwin/presentation-backend";
import { Menu, shell } from "electron";
import type { MenuItemConstructorOptions } from "electron/main";
import * as path from "path";

import { AppLoggerCategory } from "../common/LoggerCategory";
import { channelName, viewerRpcs } from "../common/ViewerConfig";
import { appInfo } from "./AppInfo";
import ViewerHandler from "./ViewerHandler";

require("dotenv-flow").config(); // eslint-disable-line @typescript-eslint/no-var-requires

/** This is the function that gets called when we start iTwinViewer via `electron ViewerMain.js` from the command line.
 * It runs in the Electron main process and hosts the iModeljs backend (IModelHost) code. It starts the render (frontend) process
 * that starts from the file "index.ts". That launches the viewer frontend (IModelApp).
 */
const viewerMain = async () => {
  // Setup logging immediately to pick up any logging during IModelHost.startup()
  Logger.initializeToConsole();
  Logger.setLevelDefault(LogLevel.Trace);
  Logger.setLevel(AppLoggerCategory.Backend, LogLevel.Info);

  const electronHost: ElectronHostOptions = {
    webResourcesPath: path.join(__dirname, "..", "..", "build"),
    rpcInterfaces: viewerRpcs,
    developmentServer: process.env.NODE_ENV === "development",
    ipcHandlers: [ViewerHandler],
    iconName: "itwin-viewer.ico",
  };

  const iModelHost = new IModelHostConfiguration();
  iModelHost.hubAccess = new BackendIModelsAccess();

  await ElectronHost.startup({ electronHost, iModelHost });

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
  // open links in the system browser instead of Electron
  // remove this if you desire the default behavior instead
  ElectronHost.mainWindow?.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    void shell.openExternal(url);
  });
};

const createMenu = () => {
  const isMac = process.platform === "darwin";

  const template = [
    {
      label: "File",
      submenu: [
        {
          id: "open-menu-item",
          label: "Open",
          click: () => {
            IpcHost.send(channelName, "open");
          },
        },
        {
          id: "download-menu-item",
          label: "Download",
          click: () => {
            IpcHost.send(channelName, "download");
          },
        },
        { type: "separator" },
        isMac
          ? { id: "close-menu-item", label: "Close", role: "close" }
          : { id: "close-menu-item", label: "Close", role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          id: "view-getting-started-menu-item",
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
        // TODO uncomment for dev as needed
        {
          label: "Reload",
          role: "reload",
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
