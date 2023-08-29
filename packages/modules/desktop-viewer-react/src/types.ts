/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { RpcInterface, RpcInterfaceDefinition } from "@itwin/core-common";
import type {
  BlankViewerProps,
  ConnectedViewerProps,
  FileViewerProps,
  ViewerCommonProps,
  XOR,
} from "@itwin/viewer-react";

export type DesktopInitializerParams = ViewerCommonProps & {
  rpcInterfaces?: RpcInterfaceDefinition<RpcInterface>[];
  clientId: string;
};

/** Desktop Viewer can open local (snapshot/briefcase), connected or blank connection models */
export type DesktopViewerProps = XOR<
  XOR<FileViewerProps, BlankViewerProps>,
  ConnectedViewerProps
> &
  DesktopInitializerParams;

// todo: rm enum in favor of as const
export enum ModelStatus {
  ONLINE,
  OUTDATED,
  DOWNLOADING,
  MERGING,
  ERROR,
  UPTODATE,
  SNAPSHOT,
  COMPARING,
}

export interface ProgressInfo {
  percent?: number;
  total?: number;
  loaded: number;
}
