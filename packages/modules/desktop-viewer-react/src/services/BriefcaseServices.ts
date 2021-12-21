/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Guid } from "@itwin/core-bentley";
import { IModelVersion } from "@itwin/core-common";
import type { BriefcaseConnection } from "@itwin/core-frontend";
import { CheckpointConnection } from "@itwin/core-frontend";

import { ModelStatus } from "..";

export const getBriefcaseStatus = async (
  briefcase: BriefcaseConnection
): Promise<ModelStatus> => {
  if (briefcase && briefcase.iTwinId && briefcase.iTwinId !== Guid.empty) {
    try {
      // get the online version
      const remoteConnection = await CheckpointConnection.openRemote(
        briefcase.iTwinId,
        briefcase.iModelId,
        IModelVersion.latest()
      );
      const hasChanges =
        briefcase.changeset.id !== remoteConnection.changeset.id;
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
