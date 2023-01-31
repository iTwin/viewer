/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IModelAppOptions } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import {
  getIModelAppOptions,
  makeCancellable,
  ViewerAuthorization,
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
      const iModelAppOptions = getIModelAppOptions(options);
      const rpcOptions = this.reconcileDefaultRpcOptions(
        options,
        iModelAppOptions
      );

      const cancellable = makeCancellable(function* () {
        ViewerPerformance.enable(options.enablePerformanceMonitors);
        ViewerPerformance.addMark("ViewerStarting");
        iModelAppOptions.authorizationClient = options.authClient;
        ViewerAuthorization.client = options.authClient;
        yield IModelApp.startup(iModelAppOptions);
        // register extensions after startup
        if (options?.extensions) {
          options.extensions.forEach((extension) => {
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
        RpcInitializer.registerClients(rpcOptions);
        console.log("web viewer started");
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

  private static reconcileDefaultRpcOptions(
    options: WebInitializerParams,
    iModelAppOptions: IModelAppOptions
  ) {
    return {
      ...options.backendConfiguration,
      defaultBackend: {
        ...options.backendConfiguration?.defaultBackend,
        rpcInterfaces: [
          ...(iModelAppOptions.rpcInterfaces ?? []),
          ...(options.backendConfiguration?.defaultBackend?.rpcInterfaces ??
            []),
        ],
      },
    };
  }
}
