/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BentleyCloudRpcParams } from "@itwin/core-common";
import type {
  BlankViewerProps,
  ItwinViewerCommonParams,
  ViewerAuthorizationClient,
  ViewerProps,
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

export interface WebViewerPropsFull extends ViewerProps {
  /** authorization configuration */
  authConfig: ViewerAuthorizationClient;
  /** options to override the default backend from iTwin Platform */
  backend?: IModelBackendOptions;
}

// TODO remove this once we support opening snapshots remotely
export type WebViewerProps = Omit<WebViewerPropsFull, "snapshotPath">;

export interface WebBlankViewerProps extends BlankViewerProps {
  /** authorization configuration */
  authConfig: ViewerAuthorizationClient;
}

export interface ItwinViewerParams extends ItwinViewerCommonParams {
  /** id of the html element where the viewer should be rendered */
  elementId: string;
  /** authorization configuration */
  authConfig: ViewerAuthorizationClient;
}
