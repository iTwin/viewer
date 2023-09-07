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

export type WebInitializerParams = ViewerCommonProps & {
  /** authorization configuration */
  backendConfiguration?: BackendConfiguration;
  authClient?: ViewerAuthorizationClient;
};

type AuthClientProps = {
  authClient: ViewerAuthorizationClient;
  iTwinId: string;
}
| {
  authClient?: ViewerAuthorizationClient;
  iTwinId?: never;
}

type ConnectedViewerWebProps = ConnectedViewerProps & Required<Pick<WebInitializerParams, "authClient">>;
type BlankViewerWebProps = BlankViewerProps & AuthClientProps;

export type WebViewerProps = XOR<ConnectedViewerWebProps, BlankViewerWebProps> &
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
