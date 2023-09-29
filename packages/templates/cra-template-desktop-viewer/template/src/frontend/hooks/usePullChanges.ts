/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BriefcaseConnection,
  OnDownloadProgress,
} from "@itwin/core-frontend";
import { useCallback, useState } from "react";

export const usePullChanges = (connection?: BriefcaseConnection) => {
  const [pullProgress, setPullProgress] = useState<number>();

  const downloadProgressCallback: OnDownloadProgress = useCallback(
    (progress) => {
      const { loaded, total } = progress;
      const percent = (loaded / total) * 100;

      setPullProgress(percent);

      console.log(`Pull changes progress (${loaded}/${total}) -> ${percent}%`);
    },
    []
  );

  const doPullChanges = useCallback(async () => {
    await connection?.pullChanges(undefined, {
      downloadProgressCallback,
      progressInterval: 100,
    });

    setPullProgress(undefined);
  }, [connection, downloadProgressCallback]);

  return { doPullChanges, pullProgress };
};
