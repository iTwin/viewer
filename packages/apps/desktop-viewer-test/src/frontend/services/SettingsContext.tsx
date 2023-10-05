/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";

import type { RecentSettings, ViewerFile } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";

export interface Settings {
  recentSettings: RecentSettings;
  addRecent: (
    path: string,
    iModelName?: string,
    iTwinId?: string,
    iModelId?: string
  ) => Promise<void>;
  checkFileExists: (file: ViewerFile) => Promise<boolean>;
}

interface SettingsContextProviderProps {
  children: React.ReactNode;
}

export const SettingsContextProvider = ({
  children,
}: SettingsContextProviderProps) => {
  const [recentSettings, setRecentSettings] = useState<RecentSettings>({});
  const location = useLocation();

  const getRecentSettings = useCallback(async () => {
    const updatedSettings = await ITwinViewerApp.ipcCall.getSettings();
    setRecentSettings(updatedSettings);
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
      const updatedSettings = await getRecentSettings();
      setRecentSettings(updatedSettings);
    },
    [getRecentSettings]
  );

  const removeRecent = useCallback(
    async (file: ViewerFile) => {
      await ITwinViewerApp.ipcCall.removeRecentFile(file);
      const updatedSettings = await getRecentSettings();
      setRecentSettings(updatedSettings);
    },
    [getRecentSettings]
  );

  const checkFileExists = useCallback(
    async (file: ViewerFile) => {
      const exists = await ITwinViewerApp.ipcCall.checkFileExists(file);
      if (!exists) {
        await removeRecent(file);
      }
      return exists;
    },
    [removeRecent]
  );

  useEffect(() => {
    const getInitialSettings = async () => {
      const recentSettings = await getRecentSettings();
      setRecentSettings(recentSettings);
    };

    void getInitialSettings();
  }, [getRecentSettings, location]);

  return (
    <SettingsContext.Provider
      value={{
        recentSettings,
        addRecent,
        checkFileExists,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsContext = createContext<Settings>({} as Settings);
