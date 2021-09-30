/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IpcListener } from "@bentley/imodeljs-common";
import {
  AsyncFunction,
  IModelApp,
  IpcApp,
  PromiseReturnType,
} from "@bentley/imodeljs-frontend";
import { NavigateFn } from "@reach/router";
import { OpenDialogOptions } from "electron";

import {
  channelName,
  ViewerConfig,
  ViewerIpc,
} from "../../common/ViewerConfig";
import { Settings } from "../services/SettingsClient";

export declare type PickAsyncMethods<T> = {
  [P in keyof T]: T[P] extends AsyncFunction ? T[P] : never;
};

type IpcMethods = PickAsyncMethods<ViewerIpc>;

export class ITwinViewerApp {
  private static _config: ViewerConfig;
  private static _menuListener: IpcListener | undefined;

  public static translate(key: string | string[], options?: any): string {
    return IModelApp.i18n.translate(`iTwinViewer:${key}`, options);
  }

  public static ipcCall = new Proxy({} as IpcMethods, {
    get(_target, key: keyof IpcMethods): AsyncFunction {
      const makeIpcCall =
        <T extends keyof IpcMethods>(methodName: T) =>
        async (...args: Parameters<IpcMethods[T]>) =>
          IpcApp.callIpcChannel(
            channelName,
            methodName,
            ...args
          ) as PromiseReturnType<ViewerIpc[T]>;

      switch (key) {
        case "getConfig":
          return async () =>
            // if we already cached getConfig results, just resolve to that
            Promise.resolve(
              (ITwinViewerApp._config ??= await makeIpcCall("getConfig")())
            );
        default:
          return makeIpcCall(key);
      }
    },
  });

  public static async getSnapshotFile(): Promise<string | undefined> {
    const options: OpenDialogOptions = {
      title: ITwinViewerApp.translate("openSnapshot"),
      properties: ["openFile"],
      filters: [{ name: "iModels", extensions: ["ibim", "bim"] }],
    };
    const val = await ITwinViewerApp.ipcCall.openFile(options);

    return val.canceled || val.filePaths.length === 0
      ? undefined
      : val.filePaths[0];
  }

  public static initializeMenuListeners(
    navigate: NavigateFn,
    userSettings: Settings
  ) {
    if (this._menuListener) {
      // initialize only once
      return;
    }
    this._menuListener = async (sender, arg) => {
      switch (arg) {
        case "snapshot":
          const snapshotPath = await ITwinViewerApp.getSnapshotFile();
          if (snapshotPath) {
            void userSettings.addRecentSnapshot(snapshotPath);
            await navigate(`/snapshot`, { state: { snapshotPath } });
          }
          break;
        case "remote":
          await navigate("/itwins");
          break;
        case "home":
          await navigate("/");
          break;
        case "preferences":
          alert("Coming Soon!");
          break;
      }
    };
    IpcApp.addListener(channelName, this._menuListener);
  }
}
