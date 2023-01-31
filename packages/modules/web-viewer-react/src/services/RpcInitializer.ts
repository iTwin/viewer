/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BentleyCloudRpcManager } from "@itwin/core-common";

import type { RegisterClientOptions } from "../types";

/**
 * The RpcInitializer handles registration of backends/instantiates RpcInterface clients.
 */
export class RpcInitializer {
  static readonly orchestratorUrl = `https://${globalThis.IMJS_URL_PREFIX}api.bentley.com`;

  /**
   * Instantiates a `DefaultBackend` and optional `CustomBackend`s. The `DefaultBackend`
   * must have at least one Rpc Interface in the `DefaultBackend.rpcInterfaces` array.
   * @param options: RegisterClientOptions
   * @returns void
   */
  public static registerClients(options: RegisterClientOptions) {
    const formattedOptions = this.formatDefaultBackendOptions(options);

    BentleyCloudRpcManager.initializeClient(
      formattedOptions,
      options.defaultBackend.rpcInterfaces
    );

    if (!options?.customBackends) {
      return;
    }

    for (const { config, rpcInterfaces } of options.customBackends) {
      BentleyCloudRpcManager.initializeClient(config, rpcInterfaces);
    }
  }

  private static formatDefaultBackendOptions(options: RegisterClientOptions) {
    if (options.defaultBackend.config?.uriPrefix) {
      return {
        info: {
          title:
            options.defaultBackend.config.info?.title ??
            this.getDefaultInfo().info.title,
          version:
            options.defaultBackend.config.info?.version ??
            this.getDefaultInfo().info.version,
        },
        uriPrefix: options.defaultBackend.config.uriPrefix,
      };
    }

    if (options.defaultBackend.config?.info) {
      if (!options.defaultBackend.config?.info?.title) {
        throw new Error("Please provide the title for the iTwin.js backend");
      }

      if (!options.defaultBackend.config?.info.version) {
        throw new Error("Please provide the version for the iTwin.js backend");
      }

      return {
        uriPrefix: this.getDefaultInfo().uriPrefix,
        info: {
          title: options.defaultBackend.config.info.title,
          version: options.defaultBackend.config.info.version,
        },
      };
    }

    return this.getDefaultInfo();
  }

  private static getDefaultInfo() {
    return {
      info: { title: "imodel/rpc", version: "" },
      uriPrefix: this.orchestratorUrl,
    };
  }
}
