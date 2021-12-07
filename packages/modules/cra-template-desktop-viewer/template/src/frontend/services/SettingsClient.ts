/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { createContext } from "react";

import { ViewerSettings } from "../../common/ViewerConfig";
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

export interface Settings {
  settings: ViewerSettings;
  addRecent: (
    path: string,
    iModelName?: string,
    iTwinId?: string,
    iModelId?: string
  ) => Promise<ViewerSettings>;
}

export const SettingsContext = createContext({
  settings: {} as ViewerSettings,
  addRecent,
} as Settings);
