/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BriefcaseConnection } from "@itwin/core-frontend";
import type { ProgressCallback } from "@itwin/core-frontend/lib/cjs/request/Request";
import { useCallback, useState } from "react";

export const usePullChanges = (connection?: BriefcaseConnection) => {
  const [pullProgress, setPullProgress] = useState<number>();

  const progressCallback: ProgressCallback = useCallback((progress) => {
    const { loaded, total, percent } = progress;

    const progressPercentage = total ? (loaded / total) * 100 : percent;
    setPullProgress(progressPercentage);

    console.log(
      `Pull changes progress (${loaded}/${total}) -> ${progressPercentage}%`
    );
  }, []);

  const doPullChanges = useCallback(async () => {
    await connection?.pullChanges(undefined, {
      progressCallback,
      progressInterval: 100,
    });

    setPullProgress(undefined);
  }, [connection, progressCallback]);

  return { doPullChanges, pullProgress };
};
