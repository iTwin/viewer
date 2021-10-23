/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import {
  BentleyCloudRpcManager,
  BentleyCloudRpcParams,
} from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import {
  BaseInitializer,
  getIModelAppOptions,
  makeCancellable,
  ViewerAuthorizationClient,
} from "@itwin/viewer-react";

import {
  IModelBackend,
  IModelBackendOptions,
  WebAuthorizationOptions,
  WebViewerProps,
} from "../types";

const getHostedConnectionInfo = async (
  backendOptions?: IModelBackendOptions
): Promise<BentleyCloudRpcParams> => {
  let prefix = "";
  switch (backendOptions?.buddiRegion) {
    case 101:
    case 103:
      prefix = "dev-";
      break;
    case 102:
      prefix = "qa-";
      break;
  }

  const orchestratorUrl = `https://${prefix}api.bentley.com/imodeljs`;

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
      info: { title: IModelBackend.GeneralPurpose, version: "v3.0" },
      uriPrefix: orchestratorUrl,
    };
  }
};

const initializeRpcParams = async (
  backendOptions?: IModelBackendOptions
): Promise<BentleyCloudRpcParams> => {
  // if rpc params for a custom backend are provided, use those
  if (backendOptions?.customBackend && backendOptions.customBackend.rpcParams) {
    return backendOptions.customBackend.rpcParams;
  } else {
    // otherwise construct params for a hosted connection
    return await getHostedConnectionInfo(backendOptions);
  }
};

export class WebInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _cancel: (() => void) | undefined;

  private static getAuthorizationClient(
    authConfig?: WebAuthorizationOptions
  ): BrowserAuthorizationClient | ViewerAuthorizationClient | undefined {
    if (!authConfig) {
      return;
    }
    if (authConfig.config) {
      return new BrowserAuthorizationClient(authConfig.config);
    } else if (authConfig.oidcClient) {
      return authConfig.oidcClient;
    } else if (authConfig.getUserManagerFunction) {
      return new ViewerAuthorizationClient(authConfig.getUserManagerFunction);
    }
  }

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
    }
  };

  /** Web viewer startup */
  public static async startWebViewer(options?: WebViewerProps) {
    if (!IModelApp.initialized && !this._initializing) {
      console.log("starting web viewer");
      this._initializing = true;
      const cancellable = makeCancellable(function* () {
        const iModelAppOptions = getIModelAppOptions(options);
        const authClient = WebInitializer.getAuthorizationClient(
          options?.authConfig
        );
        iModelAppOptions.authorizationClient = authClient;
        BaseInitializer.authClient = authClient;
        const rpcParams: BentleyCloudRpcParams = yield initializeRpcParams(
          options?.backend
        );

        yield IModelApp.startup(iModelAppOptions);
        BentleyCloudRpcManager.initializeClient(
          rpcParams,
          iModelAppOptions.rpcInterfaces ?? []
        );
        console.log("web viewer started");
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
