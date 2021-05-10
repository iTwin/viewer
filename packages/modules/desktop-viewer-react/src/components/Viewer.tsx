/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer, ViewerProps } from "@itwin/viewer-react";
import React from "react";

export const Viewer = (props: ViewerProps) => {
  //TODO desktop stuff

  return <BaseViewer {...props} />;
};
