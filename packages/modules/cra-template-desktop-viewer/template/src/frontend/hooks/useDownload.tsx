/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ProgressInfo } from "@bentley/itwin-client";
import { IModelVersion, SyncMode } from "@itwin/core-common";
import { NativeApp } from "@itwin/core-frontend";
import { useCallback, useContext, useState } from "react";

import { ITwinViewerApp } from "../app/ITwinViewerApp";
import { SettingsContext } from "../services/SettingsClient";

export const useDownload = (
  iModelId: string,
  iModelName: string,
  iTwinId: string
) => {
  const [progress, setProgress] = useState<number>();
  const userSettings = useContext(SettingsContext);

  const addRecent = useCallback(async (fileName: string) => {
    await userSettings.addRecent(fileName, iModelName, iTwinId, iModelId);
  }, []);

  const doDownload = useCallback(async () => {
    const fileName = await ITwinViewerApp.saveBriefcase(iModelName);
    if (fileName) {
      const req = await NativeApp.requestDownloadBriefcase(
        iTwinId as string,
        iModelId,
        { syncMode: SyncMode.PullOnly, fileName },
        IModelVersion.latest(),
        async (progress: ProgressInfo) => {
          setProgress(
            progress.total
              ? (progress.loaded / progress.total) * 100
              : progress.percent
          );

          console.log(
            `Progress (${progress.loaded}/${progress.total}) -> ${
              progress.total
                ? ((progress.loaded / progress.total) * 100).toPrecision(2)
                : progress.percent
            }%`
          );
        }
      );
      await req.downloadPromise;
      await addRecent(fileName);
      return fileName;
    }
  }, [iModelId, iModelName, iTwinId]);

  return { progress, doDownload };
};
