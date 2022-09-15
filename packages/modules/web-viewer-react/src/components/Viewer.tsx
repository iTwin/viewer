/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer } from "@itwin/viewer-react";
import React from "react";

import { useWebViewerInitializer } from "../hooks";
import type { WebViewerProps } from "../types";

export const Viewer = (props: WebViewerProps) => {
  const initialized = useWebViewerInitializer(props);
  console.log("useWebViewerInitializer.initialized", initialized);
  return initialized ? <BaseViewer {...props} /> : null;
};
