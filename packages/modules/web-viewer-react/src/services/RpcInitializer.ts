/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BentleyCloudRpcParams,
  RpcInterface,
  RpcInterfaceDefinition,
  RpcOperation,
  RpcRequest,
} from "@itwin/core-common";
import {
  BentleyCloudRpcManager,
  BentleyCloudRpcProtocol,
  BentleyStatus,
  IModelError,
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  RpcConfiguration,
  RpcProtocol,
} from "@itwin/core-common";
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
    const protocol = class ComponentRpcProtocol extends BentleyCloudRpcProtocol {
      public override pathPrefix: string = formattedOptions.uriPrefix!
      public info = formattedOptions.info
  
      public override supplyPathForOperation(operation: RpcOperation, request: RpcRequest<any> | undefined): string {
        const prefix = this.pathPrefix;
        const appTitle = this.info.title;
        const appVersion = this.info.version;
        const operationId = `${operation.interfaceDefinition.interfaceName}-${operation.interfaceVersion}-${operation.operationName}`;
    
        let appMode: string = "";
        let context: string = "";
        let component: string = "";
        let document: string = ""
        
        /* Note: The changesetId field is omitted in the route in the case of ReadWrite connections since the connection is generally expected to be at the
         * latest version and not some specific changeset. Also, for the first version (before any changesets), the changesetId in the route is arbitrarily
         * set to "0" instead of an empty string, since the latter is more un-intuitive for a route. However, in all other use cases, including the changesetId
         * held by the IModelRpcProps itself, the changesetId of "" (i.e., empty string) signifies the first version - this is more intuitive and retains
         * compatibility with the majority of use cases. */
    
        if (request === undefined) {
          appMode = "{modeId}";
          context = "{iTwinId}";
          component = "{iModelId}";
          document = "{changeSetId}";
        } else {
          let token = operation.policy.token(request) || RpcOperation.fallbackToken;
    
          if (!token || !token.iModelId) {
            if (RpcConfiguration.disableRoutingValidation) {
              token = { key: "" };
            } else {
              throw new IModelError(BentleyStatus.ERROR, "Invalid iModelToken for RPC operation request");
            }
          }
    
          context = encodeURIComponent(token.iTwinId || "");
          component = encodeURIComponent(token.iModelId!);
    
          document = token.changeset?.id || "0";
          appMode = "1"
        }
    
        return `${prefix}/${appTitle}/${appVersion}/mode/1/context/${context}/component/${component}/document/${document}/${operationId}`;
        }
    }
    BentleyCloudRpcManager.initializeClient(
      {...formattedOptions, protocol},
      this.getSupportedRpcs(options?.defaultBackend?.rpcInterfaces)
    );
    // if it is presentation, we'll haev to filter to no t
    if (!options?.customBackends) {
      return;
    }

    // for (const { config, rpcInterfaces } of options.customBackends) {
    //   BentleyCloudRpcManager.initializeClient(config, rpcInterfaces);
    // }


  

    // BentleyCloudRpcManager.initializeClient({...options.customBackends[0].config, protocol}, [PresentationRpcInterface]);
  
    // IModelReadRpcInterface.getClient().getConnectionProps({changeset: {id: "6a08ee60-8ae8-4356-972e-f0fed625db59"}, iModelId: "a640fdfd-f50e-4682-bc28-f61bd5de4fba", iTwinId: "72adad30-c07c-465d-a1fe-2f2dfac950a4"}).then(res => {
    //   console.log(res)
    // })
   
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
  ): BentleyCloudRpcParams & Required<Pick<BentleyCloudRpcParams, "uriPrefix">> & Required<Pick<BentleyCloudRpcParams, "info">> {
    const userUriPrefix = options?.defaultBackend?.config?.uriPrefix;
    const userTitle = options?.defaultBackend?.config?.info?.title;
    const userVersion = options?.defaultBackend?.config?.info?.version;
    const { info, uriPrefix } = this.getDefaultInfo();

    return {
      ...options,
      info: {
        title: userTitle ?? info.title,
        version: userVersion ?? info.version,
      },
      uriPrefix: userUriPrefix ?? uriPrefix,
    };
  }

  private getDefaultInfo() {
    return {
      info: { title: "imodel/rpc", version: "v4" },
      uriPrefix: this.orchestratorUrl,
    };
  }
}