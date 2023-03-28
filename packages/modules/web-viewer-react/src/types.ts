/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BentleyCloudRpcParams,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@itwin/core-common";
import type { RequireAtLeastOne } from "@itwin/core-bentley";
import type {
  BlankViewerProps,
  ConnectedViewerProps,
  ViewerAuthorizationClient,
  ViewerCommonProps,
  XOR,
} from "@itwin/viewer-react";

export type WebInitializerParams = ViewerCommonProps & {
  /** authorization configuration */
  authClient: ViewerAuthorizationClient;
  backendConfiguration?: BackendConfiguration;
};

export type WebViewerProps = XOR<ConnectedViewerProps, BlankViewerProps> &
  WebInitializerParams;

/**
 * Custom backend and rpc configuration
 */
export type BackendConfiguration = {
  defaultBackend?: RequireAtLeastOne<DefaultBackend>;
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
