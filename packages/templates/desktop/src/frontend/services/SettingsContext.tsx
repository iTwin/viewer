/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { createContext, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";

import type { ViewerFile, ViewerSettings } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";

interface ISettingsContext {
  settings: ViewerSettings;
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
  const [settings, setSettings] = useState<ViewerSettings>({});
  const location = useLocation();

  const getRecentSettings = useCallback(async () => {
    const updatedSettings = await ITwinViewerApp.ipcCall.getSettings();
    setSettings(updatedSettings);
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
        path,
      });
      await getRecentSettings();
    },
    [getRecentSettings]
  );

  const checkFileExists = useCallback(
    async (file: ViewerFile) => {
      const exists = await ITwinViewerApp.ipcCall.checkFileExists(file);
      if (!exists) {
        await ITwinViewerApp.ipcCall.removeRecentFile(file);
        await getRecentSettings();
      }
      return exists;
    },
    [getRecentSettings]
  );

  useEffect(() => {
    void getRecentSettings();
  }, [getRecentSettings, location]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        addRecent,
        checkFileExists,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
);
