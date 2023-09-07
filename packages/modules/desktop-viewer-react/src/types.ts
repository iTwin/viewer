/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { MarkRequired, Optional } from "@itwin/core-bentley";
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

export type ClientIdProps = {
  clientId: string;
  iTwinId: string;
} | {
  clientId?: string;
  iTwinId?: never;
};

type ConnectedViewerDesktopProps = ConnectedViewerProps & Required<Pick<DesktopInitializerParams, "clientId">>
type BlankViewerDesktopProps = BlankViewerProps & ClientIdProps;
type FileViewerDesktopProps = FileViewerProps & Pick<DesktopInitializerParams, "clientId">;

/** Desktop Viewer can open local (snapshot/briefcase), connected or blank connection models */
export type DesktopViewerProps = DesktopInitializerParams & XOR<
  XOR<FileViewerDesktopProps, BlankViewerDesktopProps>,
  ConnectedViewerDesktopProps
>;

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
