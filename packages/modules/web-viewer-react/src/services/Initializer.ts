/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { BentleyCloudRpcParams } from "@bentley/imodeljs-common";
import {
  IModelApp,
  IModelAppOptions,
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

  const orchestratorUrl = await urlClient.discoverUrl(
    requestContext,
    `iModelJsOrchestrator.K8S`,
    backendOptions?.buddiRegion
  );

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

  private static _checkForAuthorizationClient(
    iModelAppOptions: IModelAppOptions,
    viewerOptions?: WebViewerProps
  ) {
    const options = { ...iModelAppOptions };
    if (!viewerOptions?.authConfig.config) {
      if (viewerOptions?.authConfig.oidcClient) {
        options.authorizationClient = viewerOptions.authConfig.oidcClient;
      } else if (viewerOptions?.authConfig.getUserManagerFunction) {
        options.authorizationClient = new AuthorizationClient(
          viewerOptions.authConfig.getUserManagerFunction
        );
      }
    }
    return options;
  }

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
            iModelApp: this._checkForAuthorizationClient(
              getIModelAppOptions(options),
              options
            ),
            webViewerApp: {
              rpcParams: rpcParams,
              authConfig: options?.authConfig.config,
              routing: options?.rpcRoutingToken,
            },
          };
          await WebViewerApp.startup(webViewerOptions);

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
