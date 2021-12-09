/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ColorDef, RenderMode } from "@itwin/core-common";
import type { BlankConnection } from "@itwin/core-frontend";
import { IModelApp, SpatialViewState, ViewStatus } from "@itwin/core-frontend";

import type { BlankConnectionViewState } from "../../types";

export const createBlankViewState = (
  iModel: BlankConnection,
  viewStateOptions?: BlankConnectionViewState
): SpatialViewState => {
  const ext = iModel.projectExtents;
  const viewState = SpatialViewState.createBlank(
    iModel,
    ext.low,
    ext.high.minus(ext.low)
  );

  const allow3dManipulations =
    viewStateOptions?.setAllow3dManipulations !== undefined
      ? viewStateOptions?.setAllow3dManipulations
      : true;

  viewState.setAllow3dManipulations(allow3dManipulations);

  const viewStateLookAt = viewStateOptions?.lookAt;
  if (viewStateLookAt) {
    const viewStatus = viewState.lookAt({
      eyePoint: viewStateLookAt.eyePoint,
      targetPoint: viewStateLookAt.targetPoint,
      upVector: viewStateLookAt.upVector,
      newExtents: viewStateLookAt.newExtents,
      frontDistance: viewStateLookAt.frontDistance,
      backDistance: viewStateLookAt.backDistance,
      opts: viewStateLookAt.opts,
    });

    if (viewStatus !== ViewStatus.Success) {
      throw new Error(
        "Invalid 'lookAt' view state option: " + ViewStatus[viewStatus]
      );
    }
  }

  viewState.displayStyle.backgroundColor =
    viewStateOptions?.displayStyle?.backgroundColor ?? ColorDef.white;
  const flags = viewState.viewFlags.copy({
    grid: viewStateOptions?.viewFlags?.grid ?? false,
    renderMode:
      viewStateOptions?.viewFlags?.renderMode ?? RenderMode.SmoothShade,
  });
  viewState.displayStyle.viewFlags = flags;

  IModelApp.viewManager.onViewOpen.addOnce((vp) => {
    if (vp.view.hasSameCoordinates(viewState)) {
      vp.applyViewState(viewState);
    }
  });

  return viewState;
};
