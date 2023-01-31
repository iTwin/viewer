/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BentleyCloudRpcParams,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@itwin/core-common";
import type {
  BlankViewerProps,
  ConnectedViewerProps,
  RequireOne,
  RequireOneOf,
  ViewerAuthorizationClient,
  ViewerCommonProps,
  XOR,
} from "@itwin/viewer-react";

/**
 * Custom backend and rpc configuration
 */
export type BackendConfiguration = RequireOneOf<
  {
    defaultBackend: RequireOneOf<DefaultBackend, "rpcInterfaces" | "config">;
    customBackends: CustomBackend[];
  },
  "defaultBackend" | "customBackends"
>;

export type RegisterClientOptions = {
  defaultBackend: RequireOne<DefaultBackend, "rpcInterfaces">;
  customBackends?: CustomBackend[];
};

export type DefaultBackend = {
  rpcInterfaces?: RpcInterfaceDefinition<RpcInterface>[]; // will be combined with a set of default interfaces
  config?: Partial<BentleyCloudRpcParams>;
};

export type CustomBackend = {
  rpcInterfaces: RpcInterfaceDefinition<RpcInterface>[]; // will be combined with a set of default interfaces
  config: BentleyCloudRpcParams;
};

export type WebInitializerParams = ViewerCommonProps & {
  /** authorization configuration */
  authClient: ViewerAuthorizationClient;
  backendConfiguration?: BackendConfiguration;
};

export type WebViewerProps = XOR<ConnectedViewerProps, BlankViewerProps> &
  WebInitializerParams;

export interface ItwinViewerParams extends WebInitializerParams {
  /** id of the html element where the viewer should be rendered */
  elementId: string;
}
