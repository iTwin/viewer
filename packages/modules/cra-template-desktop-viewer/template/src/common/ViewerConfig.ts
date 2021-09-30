/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  iTwinChannel,
  SnapshotIModelRpcInterface,
} from "@bentley/imodeljs-common";
import { PresentationRpcInterface } from "@bentley/presentation-common";
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron";

export const channelName = iTwinChannel("desktop-viewer");

export interface ViewerIpc {
  getConfig: () => Promise<ViewerConfig>;
  openFile: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
  getSettings: () => Promise<ViewerSettings>;
  addRecentFile: (file: ViewerFile) => Promise<void>;
}

export interface ViewerConfig {
  snapshotName?: string;
  clientId: string;
  redirectUri: string;
  issuerUrl?: string;
}

/** RPC interfaces required by the viewer */
export const viewerRpcs = [
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  PresentationRpcInterface,
  SnapshotIModelRpcInterface,
];

export enum ViewerFileType {
  ONLINE,
  SNAPSHOT,
  LOCAL,
}

export interface ViewerFile {
  displayName: string;
  type: ViewerFileType;
  path?: string;
  iTwinId?: string;
  iModelId?: string;
}

export interface ViewerSettings {
  defaultRecent?: boolean;
  recents?: ViewerFile[];
}
