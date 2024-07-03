/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UiFramework } from "@itwin/appui-react";
import { Guid } from "@itwin/core-bentley";
import type { ChangesetIndexAndId, IModelRpcProps } from "@itwin/core-common";
import { IModelVersion } from "@itwin/core-common";
import type { IModelConnection, ViewState } from "@itwin/core-frontend";
import {
  BriefcaseConnection,
  CheckpointConnection,
  IModelApp,
  SnapshotConnection,
} from "@itwin/core-frontend";

import { createBlankViewState, ViewCreator3d } from "../../services/iModel";
import type {
  BlankConnectionViewState,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../../types";

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
    ComponentCheckpointConnection.changeset = {
      index: 0,
      id: changeSetId!
    }
    return await ComponentCheckpointConnection.openRemote(
      iTwinId,
      iModelId,
      version
    );
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
export const openLocalIModel = async (fileName: string, readonly = true) => {
  try {
    // attempt to open as a briefcase
    const connection = await BriefcaseConnection.openFile({
      fileName,
      readonly,
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

/**
 * Generate a viewstate and set it in UiFramework
 * @param connection \
 * @param viewportOptions
 * @param viewCreatorOptions
 * @param blankConnectionViewState
 * @returns
 */
export const getAndSetViewState = async (
  connection: IModelConnection,
  viewportOptions?: ViewerViewportControlOptions,
  viewCreatorOptions?: ViewerViewCreator3dOptions,
  blankConnectionViewState?: BlankConnectionViewState
): Promise<ViewState | undefined> => {
  const viewState = await getViewState(
    connection,
    viewportOptions,
    viewCreatorOptions,
    blankConnectionViewState
  );
  if (viewState) {
    UiFramework.setDefaultViewState(viewState);
  }
  return viewState;
};

/**
 * Generate a viewstate
 * @param connection
 * @param viewportOptions
 * @param viewCreatorOptions
 * @param blankConnectionViewState
 * @returns
 */
export const getViewState = async (
  connection: IModelConnection,
  viewportOptions?: ViewerViewportControlOptions,
  viewCreatorOptions?: ViewerViewCreator3dOptions,
  blankConnectionViewState?: BlankConnectionViewState
): Promise<ViewState | undefined> => {
  if (!connection.isBlankConnection() && connection.isClosed) {
    return;
  }
  let view: ViewState | undefined;
  if (viewportOptions?.viewState) {
    if (typeof viewportOptions?.viewState === "function") {
      view = await viewportOptions?.viewState(connection);
    } else {
      view = viewportOptions?.viewState;
    }
  }
  if (
    !viewportOptions?.alwaysUseSuppliedViewState &&
    (!view ||
      (view.iModel.iModelId !== connection.iModelId && connection.isOpen))
  ) {
    if (connection.isBlankConnection()) {
      view = createBlankViewState(connection, blankConnectionViewState);
    } else {
      // attempt to construct a default viewState
      const viewCreator = new ViewCreator3d(connection);
      view = await viewCreator.createDefaultView(viewCreatorOptions);
      UiFramework.setActiveSelectionScope("top-assembly");
    }
  }
  return view;
};

class ComponentCheckpointConnection extends CheckpointConnection {
  private static myProps: Partial<IModelRpcProps> = {};
  public static changeset: ChangesetIndexAndId;

  public static override async openRemote(
    iTwinId: string,
    iModelId: string,
    version: IModelVersion = IModelVersion.latest()
  ): Promise<CheckpointConnection> {
    const changeset = ComponentCheckpointConnection.changeset;

    this.myProps = {
      iTwinId,
      iModelId,
      changeset,
    };

    return super.openRemote(iTwinId, iModelId, version);
  }

  public override getRpcProps(): IModelRpcProps {
    return {
      key: this._fileKey,
      ...ComponentCheckpointConnection.myProps,
    };
  }
}
