/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { createContext } from "react";

import type { ViewerFile, ViewerSettings } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";

export const getUserSettings = async () => {
  return await ITwinViewerApp.ipcCall.getSettings();
};

export const getFileNameFromPath = (path: string) => {
  const sections = path.split("/");
  return sections[sections.length - 1];
};

export const addRecent = async (
  path: string,
  iModelName?: string,
  iTwinId?: string,
  iModelId?: string
) => {
  await ITwinViewerApp.ipcCall.addRecentFile({
    iTwinId,
    iModelId,
    displayName: iModelName ?? getFileNameFromPath(path),
    path: path,
  });
  return await getUserSettings();
};

export const removeRecent = async (file: ViewerFile) => {
  await ITwinViewerApp.ipcCall.removeRecentFile(file);
  const userSettings = await getUserSettings();
  return userSettings;
};

export const checkFileExists = async (file: ViewerFile) => {
  return await ITwinViewerApp.ipcCall.checkFileExists(file);
};

export interface Settings {
  settings: ViewerSettings;
  addRecent: (
    path: string,
    iModelName?: string,
    iTwinId?: string,
    iModelId?: string
  ) => Promise<ViewerSettings>;
  removeRecent: (file: ViewerFile) => Promise<ViewerSettings>;
  checkFileExists: (file: ViewerFile) => Promise<boolean>;
  getUserSettings: () => Promise<ViewerSettings>;
}

export const SettingsContext = createContext({
  settings: {} as ViewerSettings,
  addRecent,
  removeRecent,
  checkFileExists,
  getUserSettings,
} as Settings);
