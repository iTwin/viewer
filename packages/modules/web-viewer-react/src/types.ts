/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BentleyCloudRpcParams } from "@itwin/core-common";
import type {
  BlankViewerProps,
  ConnectedViewerProps,
  ViewerAuthorizationClient,
  ViewerCommonProps,
  XOR,
} from "@itwin/viewer-react";

/**
 * Hosted backend configuration
 */
export interface HostedBackendConfig {
  /* title for rpc config */
  title: string;
  /* in the form "vx.x" */
  version: string;
}

/**
 * Custom rpc configuration
 */
export interface CustomBackendConfig {
  rpcParams: BentleyCloudRpcParams;
}

/**
 * Backend configuration
 */
export interface IModelBackendOptions {
  hostedBackend?: HostedBackendConfig;
  customBackend?: CustomBackendConfig;
}

export type WebInitializerParams = ViewerCommonProps & {
  /** authorization configuration */
  authClient: ViewerAuthorizationClient;
  /** options to override the default backend from iTwin Platform */
  backend?: IModelBackendOptions;
};

export type WebViewerProps = XOR<ConnectedViewerProps, BlankViewerProps> &
  WebInitializerParams;

export interface ItwinViewerParams extends WebInitializerParams {
  /** id of the html element where the viewer should be rendered */
  elementId: string;
}
