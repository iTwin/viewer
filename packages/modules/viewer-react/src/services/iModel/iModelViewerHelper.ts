/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IModelConnection } from "@itwin/core-frontend";
import { BlankConnection } from "@itwin/core-frontend";

import type {
  BlankConnectionInitializationProps,
  RequiredViewerProps,
} from "../../types";
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

/**
 * Creates a remote, local, or blank connection
 * based on RequiredViewerProps passed.
 * @param RequiredViewerProps
 * @returns Promise<IModelConnection | undefined>
 */
export const openConnection = async (
  options: RequiredViewerProps
): Promise<IModelConnection | undefined> => {
  if (options.iTwinId && options.iModelId) {
    return await openRemoteIModel(
      options.iTwinId,
      options.iModelId,
      options.changeSetId
    );
  }

  if (options.filePath) {
    console.log("openming local i model");
    return await openLocalIModel(options.filePath);
  }

  if (options.extents) {
    return createBlankConnection({
      iTwinId: options.iTwinId,
      blankConnectionProps: {
        extents: options.extents,
        location: options.location,
        name: "Blank Connection",
      },
    });
  }

  if (options.blankConnection) {
    return createBlankConnection({
      iTwinId: options.iTwinId,
      blankConnectionProps: options.blankConnection,
    });
  }

  return;
};

export const missingViewerConnectionProps = (
  props: Partial<RequiredViewerProps>
): boolean => {
  const { iTwinId, iModelId, filePath, blankConnection, extents, location } =
    props;

  if (filePath) {
    return false;
  }
  if (iModelId && iTwinId) {
    return false;
  }
  if (
    blankConnection?.iTwinId ||
    (blankConnection && iTwinId) ||
    (extents && location && iTwinId)
  ) {
    return false;
  }

  return true;
};
