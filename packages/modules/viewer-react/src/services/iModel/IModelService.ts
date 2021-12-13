/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelVersion } from "@itwin/core-common";
import { CheckpointConnection, IModelApp } from "@itwin/core-frontend";

/** determine the proper version of the iModel to open
 * 1. If named versions exist, get the named version that contains the latest changeset
 * 2. If no named version exists, return the latest changeset
 */
const getVersion = async (
  iModelId: string,
  changeSetId?: string
): Promise<IModelVersion> => {
  if (changeSetId) {
    return IModelVersion.asOfChangeSet(changeSetId);
  }

  const accessToken = await IModelApp.authorizationClient?.getAccessToken();
  if (accessToken && IModelApp.hubAccess) {
    try {
      const changeset = await IModelApp.hubAccess.getChangesetFromNamedVersion({
        iModelId,
        accessToken,
      });
      return IModelVersion.asOfChangeSet(changeset.id);
    } catch {
      // default to the latest version
      return IModelVersion.latest();
    }
  }
  return IModelVersion.latest();
};

/** open and return an IModelConnection from a project's wsgId and an imodel's wsgId */
export const openRemoteIModel = async (
  iTwinId: string,
  iModelId: string,
  changeSetId?: string
): Promise<CheckpointConnection | undefined> => {
  try {
    // get the version to query
    const version = await getVersion(iModelId, changeSetId);
    // create a new connection
    return await CheckpointConnection.openRemote(iTwinId, iModelId, version);
  } catch (error) {
    console.log(`Error opening the iModel connection: ${error}`);
    throw error;
  }
};
