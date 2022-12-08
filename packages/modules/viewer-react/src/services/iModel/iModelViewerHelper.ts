/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BlankConnectionProps,
  IModelConnection,
} from "@itwin/core-frontend";
import { BlankConnection } from "@itwin/core-frontend";

import type { ModelLoaderProps, RequiredViewerProps } from "../../types";
import { openLocalIModel, openRemoteIModel } from "./IModelService";

type BlankConnectionInitializationProps = {
  iTwinId?: string;
  blankConnectionProps: BlankConnectionProps;
};
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
    return await openLocalIModel(options.filePath);
  }

  if (options.extents && options.location) {
    return createBlankConnection({
      iTwinId: options.iTwinId,
      blankConnectionProps: {
        extents: options.extents,
        location: options.location,
        name: "Blank Connection",
      },
    });
  }
  /* eslint-disable-next-line deprecation/deprecation */
  if (options.blankConnection) {
    return createBlankConnection({
      iTwinId: options.iTwinId,
      blankConnectionProps:
        options.blankConnection /* eslint-disable-line deprecation/deprecation */,
    });
  }

  return;
};

export const gatherRequiredViewerProps = ({
  iTwinId,
  iModelId,
  filePath,
  blankConnection /* eslint-disable-line deprecation/deprecation */,
  extents,
  location,
  changeSetId,
}: ModelLoaderProps): RequiredViewerProps | undefined => {
  if (filePath) {
    return { filePath };
  }

  if (iModelId && iTwinId) {
    return { iModelId, iTwinId, changeSetId };
  }

  /* eslint-disable-next-line deprecation/deprecation */
  if (
    blankConnection?.iTwinId ||
    (blankConnection && iTwinId) ||
    (extents && location && iTwinId)
  ) {
    /* eslint-disable-next-line deprecation/deprecation */
    return { blankConnection, iTwinId, extents, location };
  }

  return;
};
