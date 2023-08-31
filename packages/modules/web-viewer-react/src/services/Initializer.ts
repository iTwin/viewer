/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@itwin/core-frontend";
import {
  getIModelAppOptions,
  makeCancellable,
  ViewerAuthorization,
  ViewerAuthorizationClient,
  ViewerPerformance,
} from "@itwin/viewer-react";

import type { WebInitializerParams } from "../types";
import { RpcInitializer } from "./RpcInitializer";

export class WebInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _cancel: (() => void) | undefined;

  /** expose initialized promise */
  public static get initialized(): Promise<void> {
    return this._initialized;
  }

  /** expose initialized cancel method */
  public static cancel: () => void = () => {
    if (WebInitializer._initializing) {
      WebInitializer._cancel?.();
      IModelApp.shutdown().catch(() => {
        // Do nothing, its possible that we never started.
      });
      ViewerPerformance.clear();
    }
  };

  /** Web viewer startup */
  public static async startWebViewer(options: WebInitializerParams) {
    if (!IModelApp.initialized && !this._initializing) {
      console.log("starting web viewer");
      this._initializing = true;

      const {
        backendConfiguration,
        extensions,
        authClient,
        ...optionsForIModelApp
      } = options;

      const enablePerformanceMonitors = options.enablePerformanceMonitors;
      const iModelAppOptions = getIModelAppOptions(optionsForIModelApp);

      const cancellable = makeCancellable(function* () {
        ViewerPerformance.enable(enablePerformanceMonitors);
        ViewerPerformance.addMark("ViewerStarting");

        iModelAppOptions.authorizationClient = authClient;
        ViewerAuthorization.client = authClient;

        yield IModelApp.startup(iModelAppOptions);

        // register extensions after startup
        if (extensions) {
          extensions.forEach((extension) => {
            if (extension.hostname) {
              IModelApp.extensionAdmin.registerHost(
                `https://${extension.hostname}`
              );
            }
            IModelApp.extensionAdmin
              .addExtension(extension)
              .catch((e) => console.log(e));
          });
        }

        const rpcInitializer = new RpcInitializer();
        rpcInitializer.registerClients(backendConfiguration);

        ViewerPerformance.addMark("ViewerStarted");
        ViewerPerformance.addMeasure(
          "ViewerInitialized",
          "ViewerStarting",
          "ViewerStarted"
        );
      });

      WebInitializer._cancel = cancellable.cancel;
      this._initialized = cancellable.promise
        .catch((err) => {
          if (err.reason !== "cancelled") {
            throw err;
          }
        })
        .finally(() => {
          WebInitializer._initializing = false;
          WebInitializer._cancel = undefined;
        });
    }
  }
}
