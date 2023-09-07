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
  clientId?: string;
};

export type ClientIdRequiredProps = {
  clientId: string;
  iTwinId: string;
}

export type ClientIdOptionalProps = {
  clientId?: string;
  iTwinId?: never;
}

export type ClientIdProps = ClientIdRequiredProps | ClientIdOptionalProps;

export type ConnectedViewerDesktopProps = ConnectedViewerProps & ClientIdRequiredProps;
export type BlankViewerDesktopProps = BlankViewerProps & ClientIdProps;
export type FileViewerDesktopProps = FileViewerProps & ClientIdOptionalProps;

/** Desktop Viewer can open local (snapshot/briefcase), connected or blank connection models */
export type DesktopViewerProps = XOR<
  XOR<FileViewerDesktopProps, BlankViewerDesktopProps>,
  ConnectedViewerDesktopProps
> &
  DesktopInitializerParams;

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
