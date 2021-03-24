/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ClientRequestContext } from "@bentley/bentleyjs-core";
import {
  BentleyCloudRpcParams,
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  RpcInterface,
  RpcInterfaceDefinition,
  SnapshotIModelRpcInterface,
} from "@bentley/imodeljs-common";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import { PresentationRpcInterface } from "@bentley/presentation-common";

import { IModelBackendOptions } from "../types";

/** get rpc connection info */
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

export const getSupportedRpcs = (
  additionalRpcInterfaces: RpcInterfaceDefinition<RpcInterface>[]
): RpcInterfaceDefinition<RpcInterface>[] => {
  return [
    IModelReadRpcInterface,
    IModelTileRpcInterface,
    PresentationRpcInterface,
    SnapshotIModelRpcInterface,
    ...additionalRpcInterfaces,
  ];
};

export const getRpcParams = async (
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
