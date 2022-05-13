/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BentleyCloudRpcParams } from "@itwin/core-common";
import { BentleyCloudRpcManager } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import {
  getIModelAppOptions,
  makeCancellable,
  ViewerAuthorization,
  ViewerPerformance,
} from "@itwin/viewer-react";

import type { IModelBackendOptions, WebInitializerParams } from "../types";

const getHostedConnectionInfo = (
  backendOptions?: IModelBackendOptions
): BentleyCloudRpcParams => {
  const orchestratorUrl = `https://${
    process.env.IMJS_URL_PREFIX ?? ""
  }api.bentley.com`;

  if (backendOptions?.hostedBackend) {
    if (!backendOptions.hostedBackend.title) {
      //TODO localize
      throw new Error("Please provide the title for the iTwin.js backend");
    }
    if (!backendOptions.hostedBackend.version) {
      //TODO localize
      throw new Error("Please provide a version for the iTwin.js backend");
    }
    return {
      info: {
        title: backendOptions.hostedBackend.title,
        version: backendOptions.hostedBackend.version,
      },
      uriPrefix: orchestratorUrl,
    };
  } else {
    return {
      info: { title: "imodel/rpc", version: "" },
      uriPrefix: orchestratorUrl,
    };
  }
};

const initializeRpcParams = (
  backendOptions?: IModelBackendOptions
): BentleyCloudRpcParams => {
  // if rpc params for a custom backend are provided, use those
  if (backendOptions?.customBackend && backendOptions.customBackend.rpcParams) {
    return backendOptions.customBackend.rpcParams;
  } else {
    // otherwise construct params for a hosted connection
    return getHostedConnectionInfo(backendOptions);
  }
};

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
      if (WebInitializer._cancel) {
        WebInitializer._cancel();
      }
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
      const cancellable = makeCancellable(function* () {
        ViewerPerformance.enable(options.enablePerformanceMonitors);
        ViewerPerformance.addMark("ViewerStarting");
        const iModelAppOptions = getIModelAppOptions(options);
        iModelAppOptions.authorizationClient = options.authClient;
        ViewerAuthorization.client = options.authClient;
        const rpcParams: BentleyCloudRpcParams = initializeRpcParams(
          options?.backend
        );
        yield IModelApp.startup(iModelAppOptions);
        // register extensions after startup
        if (options?.extensions) {
          options.extensions.map((extension) => {
            if (extension.hostname) {
              IModelApp.extensionAdmin.registerHost(
                `http://${extension.hostname}`
              );
            }
            IModelApp.extensionAdmin
              .addExtension(extension)
              .catch((e) => console.log(e));
          });
        }
        BentleyCloudRpcManager.initializeClient(
          rpcParams,
          iModelAppOptions.rpcInterfaces ?? []
        );
        console.log("web viewer started");
        ViewerPerformance.addMark("ViewerStarted");
        void ViewerPerformance.addMeasure(
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
