/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { BentleyCloudRpcParams } from "@bentley/imodeljs-common";
import {
  IModelApp,
  WebViewerApp,
  WebViewerAppOpts,
} from "@bentley/imodeljs-frontend";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import { getIModelAppOptions, IModelBackendOptions } from "@itwin/viewer-react";

import { WebViewerProps } from "../types";
import AuthorizationClient from "./auth/AuthorizationClient";

const getHostedConnectionInfo = async (
  backendOptions?: IModelBackendOptions
): Promise<BentleyCloudRpcParams> => {
  const urlClient = new UrlDiscoveryClient();
  const requestContext = new ClientRequestContext();

  if (backendOptions?.hostedBackend) {
    if (!backendOptions.hostedBackend.hostType) {
      //TODO localize
      throw new Error("Please provide a host type for the iModel.js backend");
    }
    if (!backendOptions.hostedBackend.title) {
      //TODO localize
      throw new Error("Please provide the title for the iModel.js backend");
    }
    if (!backendOptions.hostedBackend.version) {
      //TODO localize
      throw new Error("Please provide a version for the iModel.js backend");
    }
    const orchestratorUrl = await urlClient.discoverUrl(
      requestContext,
      `iModelJsOrchestrator.${backendOptions.hostedBackend.hostType}`,
      backendOptions.buddiRegion
    );
    return {
      info: {
        title: backendOptions.hostedBackend.title,
        version: backendOptions.hostedBackend.version,
      },
      uriPrefix: orchestratorUrl,
    };
  } else {
    const orchestratorUrl = await urlClient.discoverUrl(
      requestContext,
      "iModelJsOrchestrator.K8S",
      backendOptions?.buddiRegion
    );
    return {
      info: { title: "general-purpose-imodeljs-backend", version: "v2.0" },
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
  private static _reject: (() => void) | undefined;

  /** expose initialized promise */
  public static get initialized(): Promise<void> {
    return this._initialized;
  }

  /** expose initialized cancel method */
  public static cancel: () => void = () => {
    if (WebInitializer._initializing) {
      if (WebInitializer._reject) {
        WebInitializer._reject();
      }
      WebViewerApp.shutdown().catch(() => {
        // Do nothing, its possible that we never started.
      });
    }
  };

  /** Web viewer startup */
  public static async startWebViewer(options?: WebViewerProps) {
    if (!IModelApp.initialized && !this._initializing) {
      console.log("starting web viewer");
      this._initializing = true;
      this._initialized = new Promise(async (resolve, reject) => {
        try {
          this._reject = () => reject("Web Startup Cancelled");
          const rpcParams = await initializeRpcParams(options?.backend);
          const webViewerOptions: WebViewerAppOpts = {
            iModelApp: getIModelAppOptions(options),
            webViewerApp: {
              rpcParams: rpcParams,
              authConfig: options?.authConfig.config,
              routing: options?.rpcRoutingToken,
            },
          };
          await WebViewerApp.startup(webViewerOptions);

          if (!IModelApp.authorizationClient) {
            if (options?.authConfig.oidcClient) {
              // Consumer provided a full client instead of just configuration
              IModelApp.authorizationClient = options?.authConfig.oidcClient;
            } else if (options?.authConfig.getUserManagerFunction) {
              IModelApp.authorizationClient = new AuthorizationClient(
                options?.authConfig.getUserManagerFunction
              );
            }
          }

          console.log("web viewer started");
          resolve();
        } catch (error) {
          console.error(error);
          reject(error);
        } finally {
          this._initializing = false;
          this._reject = undefined;
        }
      });
    }
  }
}
