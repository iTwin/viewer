/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import { IModelHostConfiguration, IpcHost } from "@itwin/core-backend";
import { Logger, LogLevel } from "@itwin/core-bentley";
import { ElectronHost, type ElectronHostOptions } from "@itwin/core-electron/lib/cjs/ElectronBackend";
import { ECSchemaRpcImpl } from "@itwin/ecschema-rpcinterface-impl";
import { BackendIModelsAccess } from "@itwin/imodels-access-backend";
import { Presentation } from "@itwin/presentation-backend";
import * as dotenvFlow from "dotenv-flow";
import { Menu, shell } from "electron";
import type { MenuItemConstructorOptions } from "electron/main";
import * as path from "path";

import { AppLoggerCategory } from "../common/LoggerCategory";
import { channelName, viewerRpcs } from "../common/ViewerConfig";
import { appInfo } from "./AppInfo";
import ViewerHandler from "./ViewerHandler";

dotenvFlow.config();

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
    webResourcesPath: path.join(__dirname, "..", "..", "dist"),
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

  ECSchemaRpcImpl.register();

  if (process.env.NODE_ENV === "development") {
    ElectronHost.mainWindow?.webContents.toggleDevTools();
  }
  // add the menu
  ElectronHost.mainWindow?.on("ready-to-show", createMenu);
  // open links in the system browser instead of Electron
  // remove this if you desire the default behavior instead
  ElectronHost.mainWindow?.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });
};

const createMenu = () => {
  const isMac = process.platform === "darwin";

  const template: MenuItemConstructorOptions[] = [
    {
      label: "File",
      submenu: [
        {
          id: "open-menu-item",
          label: "Open",
          click: () => {
            IpcHost.send(channelName, "open");
          },
          accelerator: "CommandOrControl+O",
        },
        {
          id: "download-menu-item",
          label: "Download",
          click: () => {
            IpcHost.send(channelName, "download");
          },
          accelerator: "CommandOrControl+D",
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
          accelerator: "CommandOrControl+G",
        },
      ],
    },
  ] as MenuItemConstructorOptions[];

  if (isMac) {
    const windowMenu: MenuItemConstructorOptions[] = [
      {
        label: "Minimize",
        role: "minimize",
      },
      {
        label: "Zoom",
        role: "zoom",
        accelerator: "CommandOrControl+Alt+Z",
      },
    ];

    // add a reload menu item for development only
    if (process.env.NODE_ENV === "development") {
      windowMenu.push({
        label: "Reload",
        role: "reload",
      });
    }

    template.push({
      label: "Window",
      submenu: windowMenu,
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

  const menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
  ElectronHost.mainWindow?.setMenuBarVisibility(true);
  // this is overridden in ElectronHost and set to true so it needs to be...re-overriden??
  ElectronHost.mainWindow?.setAutoHideMenuBar(false);
};

try {
  void viewerMain();
} catch (error) {
  Logger.logError(AppLoggerCategory.Backend, error as string);
  process.exitCode = 1;
}
