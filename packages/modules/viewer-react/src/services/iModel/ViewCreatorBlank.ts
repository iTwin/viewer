/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Point3d, Vector3d } from "@bentley/geometry-core";
import { ColorDef, RenderMode } from "@bentley/imodeljs-common";
import { BlankConnection, SpatialViewState } from "@bentley/imodeljs-frontend";

import { BlankConnectionViewState } from "../../types";

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

  const viewStateLookAt = viewStateOptions?.lookAt ?? {
    eyePoint: new Point3d(15, 15, 15),
    targetPoint: new Point3d(0, 0, 0),
    upVector: new Vector3d(0, 0, 1),
  };

  viewState.lookAt(
    viewStateLookAt.eyePoint,
    viewStateLookAt.targetPoint,
    viewStateLookAt.upVector,
    viewStateLookAt.newExtents,
    viewStateLookAt.frontDistance,
    viewStateLookAt.backDistance,
    viewStateLookAt.opts
  );

  viewState.displayStyle.backgroundColor =
    viewStateOptions?.displayStyle?.backgroundColor ?? ColorDef.white;
  const flags = viewState.viewFlags.clone();
  flags.grid = viewStateOptions?.viewFlags?.grid ?? false;
  flags.renderMode =
    viewStateOptions?.viewFlags?.renderMode ?? RenderMode.SmoothShade;
  viewState.displayStyle.viewFlags = flags;
  return viewState;
};
