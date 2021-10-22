/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Guid } from "@itwin/core-bentley";
import { IModelVersion } from "@itwin/core-common";
import {
  BriefcaseConnection,
  CheckpointConnection,
  IModelApp,
  SnapshotConnection,
} from "@itwin/core-frontend";

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
export const openRemoteImodel = async (
  contextId: string,
  imodelId: string,
  changeSetId?: string
): Promise<CheckpointConnection | undefined> => {
  try {
    // get the version to query
    const version = await getVersion(imodelId, changeSetId);
    // create a new connection
    return await CheckpointConnection.openRemote(contextId, imodelId, version);
  } catch (error) {
    console.log(`Error opening the iModel connection: ${error}`);
    throw error;
  }
};

/**
 * Attempt to open a local briefcase or snapshot
 * @param fileName
 * @returns
 */
export const openLocalImodel = async (fileName: string) => {
  try {
    // attempt to open as a briefcase
    const connection = await BriefcaseConnection.openFile({
      fileName,
      readonly: true,
    });
    if (connection.iTwinId === Guid.empty) {
      // assume snapshot if there is no context id
      return await SnapshotConnection.openFile(fileName);
    }
    return connection;
  } catch {
    // if that fails, attempt to open as a snapshot
    return await SnapshotConnection.openFile(fileName);
  }
};
