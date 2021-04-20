/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  BrowserAuthorizationClient,
  BrowserAuthorizationClientConfiguration,
} from "@bentley/frontend-authorization-client";
import { RpcRoutingToken } from "@bentley/imodeljs-common";
import { BlankViewerProps, ViewerProps } from "@itwin/viewer-react";
/**
 * Authorization options. Must provide one.
 */
export interface WebAuthorizationOptions {
  /** provide an existing iModel.js authorization client */
  oidcClient?: BrowserAuthorizationClient;
  /** provide configuration for an oidc client to be managed within the Viewer */
  config?: BrowserAuthorizationClientConfiguration;
}

export interface WebViewerProps extends ViewerProps {
  rpcRoutingToken?: RpcRoutingToken;
  authConfig: WebAuthorizationOptions;
}

export interface WebBlankViewerProps extends BlankViewerProps {
  authConfig: WebAuthorizationOptions;
}
