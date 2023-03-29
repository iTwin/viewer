/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { RequireAtLeastOne } from "@itwin/core-bentley";
import type {
  BentleyCloudRpcParams,
  RpcInterface,
  RpcInterfaceDefinition,
} from "@itwin/core-common";
import type {
  BlankViewerProps,
  ConnectedViewerProps,
  ViewerAuthorizationClient,
  ViewerCommonProps,
  XOR,
} from "@itwin/viewer-react";

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
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
  defaultBackend?: RequireAtLeastOne<
    Omit<Backend, "config"> & {
      config: RequireAtLeastOne<BentleyCloudRpcParams>;
    }
  >;
  customBackends?: Backend[];
};

type Backend = {
  rpcInterfaces: RpcInterfaceDefinition<RpcInterface>[];
  config: BentleyCloudRpcParams;
};
