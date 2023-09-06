/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer } from "@itwin/viewer-react";
import React from "react";

import { useDesktopViewerInitializer } from "../hooks";
import type { DesktopViewerProps } from "../types";

export const Viewer = (props: DesktopViewerProps) => {
  const initialized = useDesktopViewerInitializer({...props, clientId: ""});
  return initialized ? <BaseViewer {...props} /> : null;
};
