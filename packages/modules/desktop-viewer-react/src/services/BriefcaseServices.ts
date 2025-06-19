/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Guid } from "@itwin/core-bentley";
import type { BriefcaseConnection } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";

import { ModelStatus } from "../types.js";

export const getBriefcaseStatus = async ({
  iTwinId,
  iModelId,
  changeset,
}: BriefcaseConnection): Promise<ModelStatus> => {
  if (iTwinId !== Guid.empty) {
    try {
      const accessToken = await IModelApp.getAccessToken();
      // get the online version
      const remoteChangeset = await IModelApp.hubAccess?.getLatestChangeset({
        iModelId,
        accessToken,
      });

      const hasChanges = changeset.id !== remoteChangeset?.id;
      if (hasChanges) {
        return ModelStatus.OUTDATED;
      } else {
        return ModelStatus.UPTODATE;
      }
    } catch (error) {
      console.error(error);
      return ModelStatus.ERROR;
    }
  } else {
    return ModelStatus.SNAPSHOT;
  }
};
