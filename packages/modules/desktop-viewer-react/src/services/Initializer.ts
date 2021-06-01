/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ClientRequestContext } from "@bentley/bentleyjs-core";
import {
  ElectronApp,
  ElectronAppOpts,
} from "@bentley/electron-manager/lib/ElectronFrontend";
import { BentleyCloudRpcParams } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import { getIModelAppOptions, IModelBackendOptions } from "@itwin/viewer-react";

import { DesktopViewerProps } from "../types";

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

export class DesktopInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _reject: (() => void) | undefined;

  /** expose initialized promise */
  public static get initialized(): Promise<void> {
    return this._initialized;
  }

  /** expose initialized cancel method */
  public static cancel: () => void = () => {
    if (DesktopInitializer._initializing) {
      if (DesktopInitializer._reject) {
        DesktopInitializer._reject();
      }
      ElectronApp.shutdown().catch(() => {
        // Do nothing, its possible that we never started.
      });
    }
  };

  /** Web viewer startup */
  public static async startDesktopViewer(options?: DesktopViewerProps) {
    if (!IModelApp.initialized && !this._initializing) {
      console.log("starting desktop viewer");
      this._initializing = true;
      this._initialized = new Promise(async (resolve, reject) => {
        try {
          this._reject = () => reject("Desktop Startup Cancelled");
          const rpcParams = await initializeRpcParams(options?.backend);
          const electronViewerOpts: ElectronAppOpts = {
            iModelApp: getIModelAppOptions(options),
          };
          await ElectronApp.startup(electronViewerOpts);

          console.log("desktop viewer started");
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
