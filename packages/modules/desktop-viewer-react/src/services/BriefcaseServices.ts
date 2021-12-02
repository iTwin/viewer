/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Guid } from "@bentley/bentleyjs-core";
import { IModelVersion } from "@bentley/imodeljs-common";
import {
  BriefcaseConnection,
  CheckpointConnection,
} from "@bentley/imodeljs-frontend";

import { ModelStatus } from "..";

export const getBriefcaseStatus = async (
  briefcase: BriefcaseConnection
): Promise<ModelStatus> => {
  if (briefcase && briefcase.contextId && briefcase.contextId !== Guid.empty) {
    try {
      // get the online version
      const remoteConnection = await CheckpointConnection.openRemote(
        briefcase.contextId,
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
    } catch {
      return ModelStatus.ERROR;
    }
  } else {
    return ModelStatus.SNAPSHOT;
  }
};
