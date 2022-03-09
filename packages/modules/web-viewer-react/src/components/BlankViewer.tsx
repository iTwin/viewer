/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseBlankViewer, BaseViewer } from "@itwin/viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { useWebViewerInitializer } from "../hooks";
import { WebInitializer } from "../services/Initializer";
import type { WebBlankViewerProps } from "../types";

export const BlankViewer = (props: WebBlankViewerProps) => {
  const memoizedProps = useMemo(() => ({ ...props }), [props]);
  const initialized = useWebViewerInitializer(memoizedProps);

  return initialized ? <BaseViewer {...memoizedProps} /> : null;
};
