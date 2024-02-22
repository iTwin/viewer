/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@itwin/core-frontend";
import { BaseViewer } from "@itwin/viewer-react";
import React, { useEffect } from "react";

import { useWebViewerInitializer } from "../hooks";
import type { WebViewerProps } from "../types";

export const Viewer = (props: WebViewerProps) => {
  const initialized = useWebViewerInitializer(props);
  useEffect(() => {
    const handleBeforeUnload = async () => {
      IModelApp.shutdown()
        .then(() => console.log("Shutdown success."))
        .catch(() => console.warn("Shutdown failed."));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return initialized ? <BaseViewer {...props} /> : null;
};
