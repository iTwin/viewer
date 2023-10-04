/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

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
  ) => Promise<void>;
  removeRecent: (file: ViewerFile) => Promise<void>;
  checkFileExists: (file: ViewerFile) => Promise<boolean>;
  getUserSettings: () => Promise<ViewerSettings>;
}

interface SettingsContextProviderProps {
  children: React.ReactNode;
}

export const SettingsContextProvider = ({
  children,
}: SettingsContextProviderProps) => {
  const [settings, setSettings] = useState<ViewerSettings>();

  const getUserSettings = useCallback(async () => {
    const updatedSettings = await ITwinViewerApp.ipcCall.getSettings();
    setSettings(updatedSettings);
    return updatedSettings;
  }, []);

  const addRecent = useCallback(
    async (
      path: string,
      iModelName?: string,
      iTwinId?: string,
      iModelId?: string
    ) => {
      // Getting file name from path incase there is no iModel name.
      const sections = path.split("/");
      const fileName = sections[sections.length - 1];

      await ITwinViewerApp.ipcCall.addRecentFile({
        iTwinId,
        iModelId,
        displayName: iModelName ?? fileName,
        path: path,
      });
      const updatedSettings = await getUserSettings();
      setSettings(updatedSettings);
    },
    [getUserSettings]
  );

  const removeRecent = useCallback(
    async (file: ViewerFile) => {
      await ITwinViewerApp.ipcCall.removeRecentFile(file);
      const updatedSettings = await getUserSettings();
      setSettings(updatedSettings);
    },
    [getUserSettings]
  );

  const checkFileExists = useCallback(async (file: ViewerFile) => {
    return await ITwinViewerApp.ipcCall.checkFileExists(file);
  }, []);

  useEffect(() => {
    const getInitialSettings = async () => {
      const userSettings = await getUserSettings();
      setSettings(userSettings);
    };

    void getInitialSettings();
  }, [getUserSettings]);

  return settings ? (
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
