/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BentleyCloudRpcParams,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@itwin/core-common";
import {
  BentleyCloudRpcManager,
  IModelReadRpcInterface,
  IModelTileRpcInterface,
} from "@itwin/core-common";
import { ECSchemaRpcInterface } from "@itwin/ecschema-rpcinterface-common";
import { PresentationRpcInterface } from "@itwin/presentation-common";

import type { BackendConfiguration } from "../types";

/**
 * The RpcInitializer handles registration of backends/instantiates RpcInterface clients.
 */
export class RpcInitializer {
  readonly orchestratorUrl = `https://${globalThis.IMJS_URL_PREFIX}api.bentley.com`;

  /**
   * Instantiates a `DefaultBackend` and optional `CustomBackend`s. The `DefaultBackend`
   * must have at least one Rpc Interface in the `DefaultBackend.rpcInterfaces` array.
   * @param options: BackendConfiguration
   * @returns void
   */
  public registerClients(options?: BackendConfiguration) {
    const formattedOptions = this.formatDefaultBackendOptions(options);

    BentleyCloudRpcManager.initializeClient(
      formattedOptions,
      this.getSupportedRpcs(options?.defaultBackend?.rpcInterfaces)
    );

    if (!options?.customBackends) {
      return;
    }

    for (const { config, rpcInterfaces } of options.customBackends) {
      BentleyCloudRpcManager.initializeClient(config, rpcInterfaces);
    }
  }

  /**
   * Merges user-supplied RpcInterfaces with default RpcInterfaces
   * @param additionalRpcInterfaces
   * @returns RpcInterfaceDefinition<RpcInterface>
   */
  public getSupportedRpcs = (
    additionalRpcInterfaces: RpcInterfaceDefinition<RpcInterface>[] = []
  ): RpcInterfaceDefinition<RpcInterface>[] => {
    return [
      IModelReadRpcInterface,
      IModelTileRpcInterface,
      PresentationRpcInterface,
      ECSchemaRpcInterface,
      ...additionalRpcInterfaces,
    ];
  };

  /**
   * Reconciles user provided rpc configuration with default values.
   * @param options: BackendConfiguration
   * @returns BentleyCloudRpcParams
   */
  private formatDefaultBackendOptions(
    options?: BackendConfiguration
  ): BentleyCloudRpcParams {
    const userUriPrefix = options?.defaultBackend?.config?.uriPrefix;
    const userTitle = options?.defaultBackend?.config?.info?.title;
    const userVersion = options?.defaultBackend?.config?.info?.version;
    const { info, uriPrefix } = this.getDefaultInfo();

    return {
      info: {
        title: userTitle ?? info.title,
        version: userVersion ?? info.version,
      },
      uriPrefix: userUriPrefix ?? uriPrefix,
    };
  }

  private getDefaultInfo() {
    return {
      info: { title: "imodel/rpc", version: "v5" },
      uriPrefix: this.orchestratorUrl,
    };
  }
}
