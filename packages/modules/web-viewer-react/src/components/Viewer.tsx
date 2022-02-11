/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer } from "@itwin/viewer-react";
import React, { useMemo } from "react";

import { useWebViewerInitializer } from "../hooks";
import type { WebViewerProps } from "../types";

export const Viewer = (props: WebViewerProps) => {
  const memoizedProps = useMemo(() => {
    return { ...props };
  }, [props]);

  const initialized = useWebViewerInitializer(memoizedProps);

  return initialized ? <BaseViewer {...props} /> : null;
};
