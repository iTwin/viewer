/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type {
  BlankConnectionProps,
  IModelConnection,
} from "@itwin/core-frontend";
import { BlankConnection } from "@itwin/core-frontend";

import type {
  BlankConnectionInitializationProps,
  ModelLoaderProps,
  RequiredViewerConnectionProps,
} from "../../types";
import { ConnectionType } from "../../types";
import { openLocalIModel, openRemoteIModel } from "./IModelService";

/**
 * Create a blank connection with default props
 * @param BlankConnectionInitializationProps
 * @returns BlankConnection
 */
export const createBlankConnection = ({
  iTwinId,
  blankConnectionProps,
}: BlankConnectionInitializationProps) =>
  BlankConnection.create({
    iTwinId,
    ...blankConnectionProps,
  });

export const getConnectionType = ({
  iTwinId,
  iModelId,
  filePath,
  blankConnection,
  extents,
  location,
}: RequiredViewerConnectionProps): ConnectionType => {
  if (filePath) {
    return ConnectionType.Local;
  }
  if (iModelId && iTwinId) {
    return ConnectionType.Remote;
  }
  if (
    blankConnection?.iTwinId ||
    (blankConnection && iTwinId) ||
    (extents && location && iTwinId)
  ) {
    return ConnectionType.Blank;
  }

  return ConnectionType.None;
};

export const openConnection = async (
  connectionType: ConnectionType,
  {
    iTwinId,
    iModelId,
    changeSetId,
    filePath,
    blankConnection,
    extents,
    location,
  }: ModelLoaderProps
): Promise<IModelConnection | undefined> => {
  switch (connectionType) {
    case ConnectionType.Remote:
      return await openRemoteIModel(iTwinId!, iModelId!, changeSetId);

    case ConnectionType.Local:
      return await openLocalIModel(filePath!);

    case ConnectionType.Blank:
      const blankConnectionProps: BlankConnectionProps = blankConnection || {
        extents: extents!,
        location: location!,
        name: "Blank Connection",
      };

      return createBlankConnection({
        iTwinId,
        blankConnectionProps,
      });
  }

  return undefined;
};
