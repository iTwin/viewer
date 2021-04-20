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
import {
  BaseInitializer,
  getIModelAppOptions,
  IModelBackendOptions,
} from "@itwin/viewer-react";

import { WebViewerProps } from "../types";

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

/** initialize WebViewerApp and the BaseViewer */
export const initializeViewer = async (options?: WebViewerProps) => {
  if (!IModelApp.initialized) {
    // do not initialize more than once
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
    if (!IModelApp.authorizationClient && options?.authConfig.oidcClient) {
      IModelApp.authorizationClient = options?.authConfig.oidcClient;
    }
  }
  return BaseInitializer.initialize(options).then(() => {
    return BaseInitializer.initialized;
  });
};
