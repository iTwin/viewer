/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BackendConfiguration,
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

export interface ItwinViewerParams extends WebInitializerParams {
  /** id of the html element where the viewer should be rendered */
  elementId: string;
}
