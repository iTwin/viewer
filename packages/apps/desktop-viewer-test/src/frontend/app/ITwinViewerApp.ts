/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  AsyncMethodsOf,
  IModelApp,
  IpcApp,
  PromiseReturnType,
} from "@bentley/imodeljs-frontend";

import {
  channelName,
  ViewerConfig,
  ViewerIpc,
} from "../../common/ViewerConfig";

// this is a singleton - all methods are static and no instances may be created
export class ITwinViewerApp {
  public static config: ViewerConfig;

  public static translate(key: string | string[], options?: any): string {
    return IModelApp.i18n.translate(`iTwinViewer:${key}`, options);
  }
  public static async callBackend<T extends AsyncMethodsOf<ViewerIpc>>(
    methodName: T,
    ...args: Parameters<ViewerIpc[T]>
  ) {
    return IpcApp.callIpcChannel(
      channelName,
      methodName,
      ...args
    ) as PromiseReturnType<ViewerIpc[T]>;
  }
  public static async getConfig(): Promise<ViewerConfig> {
    if (!this.config) {
      this.config = await this.callBackend("getConfig");
    }
    return this.config;
  }
}
