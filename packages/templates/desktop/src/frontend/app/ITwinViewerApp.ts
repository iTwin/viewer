/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AsyncFunction, PromiseReturnType } from "@itwin/core-bentley";
import type { IpcListener } from "@itwin/core-common";
import { IModelApp, IpcApp } from "@itwin/core-frontend";
import type { OpenDialogOptions, SaveDialogOptions } from "electron";
import type { NavigateFunction } from "react-router-dom";

import { channelName, type ViewerConfig, type ViewerIpc } from "../../common/ViewerConfig";

export declare type PickAsyncMethods<T> = {
  [P in keyof T]: T[P] extends AsyncFunction ? T[P] : never;
};

type IpcMethods = PickAsyncMethods<ViewerIpc>;

export class ITwinViewerApp {
  private static _config: ViewerConfig;
  private static _menuListener: IpcListener | undefined;

  private static _getFileName(iModelName?: string) {
    return iModelName ? iModelName.replace(/\s/g, "") : "Untitled";
  }

  public static translate(key: string | string[], options?: any): string {
    return IModelApp.localization.getLocalizedString(
      `iTwinDesktopViewer:${key}`,
      options
    );
  }

  public static ipcCall = new Proxy({} as IpcMethods, {
    get(_target, key: keyof IpcMethods): AsyncFunction {
      const makeIpcCall =
        <T extends keyof IpcMethods>(methodName: T) =>
        async (args: Parameters<IpcMethods[T]>) =>
          IpcApp.callIpcChannel(    // eslint-disable-line @typescript-eslint/no-deprecated
            channelName,
            methodName,
            args
          ) as PromiseReturnType<ViewerIpc[T]>;

      switch (key) {
        case "getConfig":
          return async () => {
            if (!ITwinViewerApp._config) {
              ITwinViewerApp._config = await makeIpcCall("getConfig")([]);
            }
            return ITwinViewerApp._config;
          };
        default:
          return makeIpcCall(key);
      }
    },
  });

  public static async getFile(): Promise<string | undefined> {
    const options: OpenDialogOptions = {
      title: ITwinViewerApp.translate("open"),
      properties: ["openFile"],
      filters: [{ name: "iModels", extensions: ["ibim", "bim"] }],
    };
    const val = await ITwinViewerApp.ipcCall.openFile(options);

    return val.canceled || val.filePaths.length === 0
      ? undefined
      : val.filePaths[0];
  }

  public static initializeMenuListeners(
    navigate: NavigateFunction,
    addRecent: (
      path: string,
      iModelName?: string,
      iTwinId?: string,
      iModelId?: string
    ) => Promise<void>
  ) {
    if (this._menuListener) {
      // initialize only once
      return;
    }
    this._menuListener = async (sender, arg) => {
      switch (arg) {
        case "open":
          const filePath = await ITwinViewerApp.getFile();
          if (filePath) {
            void addRecent(filePath);
            await navigate(`/viewer`, { state: { filePath } });   // eslint-disable-line @typescript-eslint/await-thenable
          }
          break;
        case "download":
          await navigate("/itwins");    // eslint-disable-line @typescript-eslint/await-thenable
          break;
        case "home":
          await navigate("/");    // eslint-disable-line @typescript-eslint/await-thenable
          break;
        case "preferences":
          alert("Coming Soon!");
          break;
      }
    };
    IpcApp.addListener(channelName, this._menuListener);
  }

  public static async saveBriefcase(
    iModelName?: string
  ): Promise<string | undefined> {
    const options: SaveDialogOptions = {
      title: ITwinViewerApp.translate("saveBriefcase"),
      defaultPath: `${this._getFileName(iModelName)}.bim`,
      filters: [{ name: "iModels", extensions: ["ibim", "bim"] }],
    };
    const val = await ITwinViewerApp.ipcCall.saveFile(options);

    return val.canceled || !val.filePath ? undefined : val.filePath;
  }
}
