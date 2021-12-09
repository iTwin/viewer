/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer } from "@itwin/viewer-react";
import React, { useMemo } from "react";

import { useDesktopViewerInitializer } from "../hooks";
import type { DesktopViewerProps } from "../types";

export const Viewer = (props: DesktopViewerProps) => {
  const memoizedProps = useMemo(() => {
    return { ...props };
  }, [props]);

  const initialized = useDesktopViewerInitializer(memoizedProps);

  return initialized ? <BaseViewer {...memoizedProps} /> : null; //TODO loader?
};
