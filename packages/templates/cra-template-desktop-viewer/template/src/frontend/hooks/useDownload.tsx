/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelVersion, SyncMode } from "@itwin/core-common";
import type { OnDownloadProgress } from "@itwin/core-frontend";
import { NativeApp } from "@itwin/core-frontend";
import { useCallback, useContext, useState } from "react";

import { ITwinViewerApp } from "../app/ITwinViewerApp";
import { SettingsContext } from "../services/SettingsContext";

export const useDownload = (
  iModelId: string,
  iModelName: string,
  iTwinId: string
) => {
  const [progress, setProgress] = useState<number>();
  const userSettings = useContext(SettingsContext);

  const addRecent = useCallback(
    async (fileName: string) => {
      await userSettings.addRecent(fileName, iModelName, iTwinId, iModelId);
    },
    [iModelName, iModelId, iTwinId, userSettings]
  );

  const doDownload = useCallback(async () => {
    const fileName = await ITwinViewerApp.saveBriefcase(iModelName);
    if (fileName) {
      const progressCallback: OnDownloadProgress = (progress) => {
        const { loaded, total } = progress;
        const percent = (loaded / total) * 100;

        setProgress(percent);
        console.log(
          `Briefcase download progress (${loaded}/${total}) -> ${percent}%`
        );
      };

      const req = await NativeApp.requestDownloadBriefcase(
        iTwinId,
        iModelId,
        { syncMode: SyncMode.PullOnly, fileName, progressCallback },
        IModelVersion.latest()
      );
      await req.downloadPromise;
      await addRecent(fileName);
      return fileName;
    }
  }, [iModelId, iModelName, iTwinId, addRecent]);

  return { progress, doDownload };
};
