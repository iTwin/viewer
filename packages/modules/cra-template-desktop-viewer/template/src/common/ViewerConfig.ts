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
import { OpenDialogReturnValue } from "electron";

export const channelName = iTwinChannel("desktop-viewer");

export interface ViewerIpc {
  getConfig: () => Promise<ViewerConfig>;
  openFile: (options: any) => Promise<OpenDialogReturnValue>;
}

export interface ViewerConfig {
  snapshotName?: string;
  clientId: string;
  redirectUri: string;
  issuer?: string;
}

/** RPC interfaces required by the viewer */
export const viewerRpcs = [
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  PresentationRpcInterface,
  SnapshotIModelRpcInterface,
];
