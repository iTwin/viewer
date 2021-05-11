/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@bentley/frontend-authorization-client";
import { RpcRoutingToken } from "@bentley/imodeljs-common";
import {
  BlankViewerProps,
  ItwinViewerCommonParams,
  ViewerProps,
} from "@itwin/viewer-react";
import { UserManager } from "oidc-client";

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

export interface WebViewerPropsFull extends ViewerProps {
  /** routing token for rpcs */
  rpcRoutingToken?: RpcRoutingToken;
  /** authorization configuration */
  authConfig: WebAuthorizationOptions;
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
