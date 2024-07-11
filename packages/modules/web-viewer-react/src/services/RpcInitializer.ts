/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BentleyCloudRpcProtocol,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@itwin/core-common";
import {
  BentleyCloudRpcManager,
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  RpcProtocol,
} from "@itwin/core-common";
import { PresentationRpcInterface } from "@itwin/presentation-common";

import type { BackendConfiguration, DefaultBackendOptions } from "../types";
import { createComponentRpcProtocol } from "./ComponentRpcProtocol";

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
  ): DefaultBackendOptions {
    const userUriPrefix = options?.defaultBackend?.config?.uriPrefix;
    const userTitle = options?.defaultBackend?.config?.info?.title;
    const userVersion = options?.defaultBackend?.config?.info?.version;
    const { info, uriPrefix } = this.getDefaultInfo();
    const _options = {
      ...options,
      info: {
        title: userTitle ?? info.title,
        version: userVersion ?? info.version,
      },
      uriPrefix: userUriPrefix ?? uriPrefix,
      protocol: undefined,
    };

    if (options?.isComponent) {
      (_options.protocol as unknown as typeof BentleyCloudRpcProtocol) =
        createComponentRpcProtocol(uriPrefix, info);
    }

    return _options;
  }

  private getDefaultInfo() {
    return {
      info: { title: "imodel/rpc", version: "v4" },
      uriPrefix: this.orchestratorUrl,
    };
  }
}
