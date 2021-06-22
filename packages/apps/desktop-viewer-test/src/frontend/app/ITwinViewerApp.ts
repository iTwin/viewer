/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { FrontendAuthorizationClient } from "@bentley/frontend-authorization-client";
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
import { AppState, AppStore } from "./AppState";
// cspell: ignore urlps

// this is a singleton - all methods are static and no instances may be created
export class ITwinViewerApp {
  private static _appState: AppState;
  public static config: ViewerConfig;

  public static get store(): AppStore {
    return this._appState.store;
  }

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

  public static async startup(): Promise<void> {
    this._appState = new AppState();
  }
}
