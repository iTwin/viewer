/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { InternetConnectivityStatus } from "@itwin/core-common";
import { iTwinChannel } from "@itwin/core-common";
import type {
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
} from "electron";

export const channelName = iTwinChannel("desktop-viewer");

export interface ViewerIpc {
  openFile: (options: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
  getSettings: () => Promise<ViewerSettings>;
  addRecentFile: (file: ViewerFile) => Promise<void>;
  saveFile: (options: SaveDialogOptions) => Promise<SaveDialogReturnValue>;
  setConnectivity: (
    connectivityStatus: InternetConnectivityStatus
  ) => Promise<void>;
}

export interface ViewerFile {
  displayName: string;
  path: string;
  iTwinId?: string;
  iModelId?: string;
}

export interface ViewerSettings {
  defaultRecent?: boolean;
  recents?: ViewerFile[];
}

/** List of LoggerCategories for this app.  For more details on Logging Categories, check out the [Category](https://www.imodeljs.org/learning/common/logging/#categories) documentation. */
export enum AppLoggerCategory {
  Frontend = "iTwinViewer.Frontend",
  Backend = "iTwinViewer.Backend",
}
