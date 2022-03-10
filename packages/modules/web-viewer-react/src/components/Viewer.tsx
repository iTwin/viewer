/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer } from "@itwin/viewer-react";
import React, { useMemo } from "react";

import { useWebViewerInitializer } from "../hooks";
import type { WebProps } from "../types";

export const Viewer = (props: WebProps) => {
  const memoizedProps = useMemo(() => ({ ...props }), [props]);
  const initialized = useWebViewerInitializer(memoizedProps);

  return initialized ? <BaseViewer {...memoizedProps} /> : null;
};
