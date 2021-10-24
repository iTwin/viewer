/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@itwin/browser-authorization";
import { BentleyCloudRpcParams, RpcRoutingToken } from "@itwin/core-common";
import {
  BlankViewerProps,
  ItwinViewerCommonParams,
  UserManager,
  ViewerProps,
} from "@itwin/viewer-react";

/**
 * Authorization options. Must provide one.
 */
export interface WebAuthorizationOptions {
  /** provide an existing iTwin.js authorization client */
  oidcClient?: BrowserAuthorizationClient;
  /** provide configuration for an oidc client to be managed within the Viewer */
  config?: BrowserAuthorizationClientConfiguration;
  /** reference to a function that returns a pre-configured oidc UserManager */
  getUserManagerFunction?: () => UserManager;
}

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

export interface WebViewerPropsFull extends ViewerProps {
  /** authorization configuration */
  authConfig: WebAuthorizationOptions;
  /** options to override the default backend from iTwin Platform */
  backend?: IModelBackendOptions;
}

// TODO remove this once we support opening snapshots remotely
export type WebViewerProps = Omit<WebViewerPropsFull, "snapshotPath">;

export interface WebBlankViewerProps extends BlankViewerProps {
  /** authorization configuration */
  authConfig: WebAuthorizationOptions;
}

export interface ItwinViewerParams extends ItwinViewerCommonParams {
  /** id of the html element where the viewer should be rendered */
  elementId: string;
  /** routing token for rpcs */
  rpcRoutingToken?: RpcRoutingToken;
  /** authorization configuration */
  authConfig: WebAuthorizationOptions;
}
