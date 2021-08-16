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
  // this is a singleton - all methods are static and no instances may be created
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  private static config: ViewerConfig;

  public static translate(key: string | string[], options?: any): string {
    return IModelApp.i18n.translate(`iTwinViewer:${key}`, options);
  }

  // This proxy object forwards any method calls to the backend over IPC.
  // This way, you can call all ipc methods like `ITwinViewerApp.ipcCall.openFile(args)`
  // Any new backend/ipc methods you need should be added to the ViewerIpc interface, and then implemented in the ViewerHandler
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
}
