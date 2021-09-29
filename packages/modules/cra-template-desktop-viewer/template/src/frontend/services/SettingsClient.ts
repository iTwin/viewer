/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { createContext } from "react";

import { ViewerFileType, ViewerSettings } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";

export const getUserSettings = async () => {
  return await ITwinViewerApp.ipcCall.getSettings();
};

export const getFileNameFromPath = (path: string) => {
  const sections = path.split("/");
  return sections[sections.length - 1];
};

export const addRecentSnapshot = async (path: string) => {
  await ITwinViewerApp.ipcCall.addRecentFile({
    path,
    displayName: getFileNameFromPath(path),
    type: ViewerFileType.SNAPSHOT,
  });
  return await getUserSettings();
};

export const addRecentOnline = async (
  iTwinId: string,
  iModelId: string,
  iModelName?: string
) => {
  await ITwinViewerApp.ipcCall.addRecentFile({
    iTwinId,
    iModelId,
    displayName: iModelName ?? iModelId,
    type: ViewerFileType.ONLINE,
  });
  return await getUserSettings();
};

export interface Settings {
  settings: ViewerSettings;
  addRecentOnline: (
    iTwinId: string,
    iModelId: string,
    iModelName?: string
  ) => Promise<ViewerSettings>;
  addRecentSnapshot: (path: string) => Promise<ViewerSettings>;
}

export const SettingsContext = createContext({
  settings: {} as ViewerSettings,
  addRecentOnline,
  addRecentSnapshot,
} as Settings);
