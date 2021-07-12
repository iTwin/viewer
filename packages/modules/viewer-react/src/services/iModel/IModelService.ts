/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Id64, Id64String } from "@bentley/bentleyjs-core";
import { IModelHubClient, VersionQuery } from "@bentley/imodelhub-client";
import { IModelVersion } from "@bentley/imodeljs-common";
import {
  CheckpointConnection,
  IModelApp,
  IModelConnection,
} from "@bentley/imodeljs-frontend";
import { AuthorizedClientRequestContext } from "@bentley/itwin-client";

import { BaseInitializer } from "../BaseInitializer";

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
  const token = await IModelApp.authorizationClient?.getAccessToken();
  if (token) {
    try {
      const requestContext = new AuthorizedClientRequestContext(token);
      const hubClient = new IModelHubClient();
      const namedVersions = await hubClient.versions.get(
        requestContext,
        iModelId,
        new VersionQuery().top(1)
      );
      // if there is a named version (version with the latest changeset "should" be at the top), return the version as of its changeset
      // otherwise return the version as of the latest changeset
      return namedVersions.length === 1 && namedVersions[0].changeSetId
        ? IModelVersion.asOfChangeSet(namedVersions[0].changeSetId)
        : IModelVersion.latest();
    } catch {
      // default to the latest version
      return IModelVersion.latest();
    }
  }
  return IModelVersion.latest();
};

/** parse the comma-delimited config value that is a list of accepted schema:classnames or return a default */
const getAcceptedViewClasses = (): string[] => {
  // TODO configurable? support for 2d (DrawingViewDefinition)?
  const acceptedClasses = [
    "BisCore:SpatialViewDefinition",
    "BisCore:OrthographicViewDefinition",
  ];
  return acceptedClasses;
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
