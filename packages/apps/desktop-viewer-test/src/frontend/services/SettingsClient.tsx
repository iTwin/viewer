/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { InternetConnectivityStatus } from "@itwin/core-common";
import React, { createContext, useCallback, useEffect, useState } from "react";

import type { ViewerFile, ViewerSettings } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";

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

export interface SettingsContextProviderProps {
  children: React.ReactNode;
  initialized: boolean;
  connectivity: InternetConnectivityStatus;
}

export const SettingsContextProvider = ({
  children,
  initialized,
  connectivity,
}: SettingsContextProviderProps) => {
  const [settings, setSettings] = useState<ViewerSettings>();

  const getUserSettings = useCallback(async () => {
    const updatedSettings = await ITwinViewerApp.ipcCall.getSettings();
    setSettings(updatedSettings);
    return updatedSettings;
  }, []);

  const getFileNameFromPath = (path: string) => {
    const sections = path.split("/");
    return sections[sections.length - 1];
  };

  const addRecent = useCallback(
    async (
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
      const updatedSettings = await getUserSettings();
      setSettings(updatedSettings);
      return updatedSettings;
    },
    []
  );

  const removeRecent = useCallback(async (file: ViewerFile) => {
    await ITwinViewerApp.ipcCall.removeRecentFile(file);
    const updatedSettings = await getUserSettings();
    setSettings(updatedSettings);
    return updatedSettings;
  }, []);

  const checkFileExists = useCallback(async (file: ViewerFile) => {
    return await ITwinViewerApp.ipcCall.checkFileExists(file);
  }, []);

  useEffect(() => {
    const getInitialSettings = async () => {
      const userSettings = await getUserSettings();
      setSettings(userSettings);
    };

    if (initialized) {
      void getInitialSettings();
    }
  }, [initialized, connectivity, getUserSettings]);

  return initialized && settings ? (
    <SettingsContext.Provider
      value={{
        settings,
        addRecent,
        removeRecent,
        checkFileExists,
        getUserSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  ) : (
    <></>
  );
};

export const SettingsContext = createContext<Settings>({} as Settings);
