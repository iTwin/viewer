/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  AsyncFunction,
  IModelApp,
  IpcApp,
  PromiseReturnType,
} from "@bentley/imodeljs-frontend";
import { OpenDialogOptions } from "electron";

import {
  channelName,
  ViewerConfig,
  ViewerIpc,
} from "../../common/ViewerConfig";

export declare type PickAsyncMethods<T> = {
  [P in keyof T]: T[P] extends AsyncFunction ? T[P] : never;
};

type IpcMethods = PickAsyncMethods<ViewerIpc>;

export class ITwinViewerApp {
  private static config: ViewerConfig;

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
              (ITwinViewerApp.config ??= await makeIpcCall("getConfig")())
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
}
