/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@itwin/core-frontend";
import { Presentation } from "@itwin/presentation-frontend";
import { BaseViewer } from "@itwin/viewer-react";
import React, { useEffect } from "react";

import { useWebViewerInitializer } from "../hooks/index.js";
import type { WebViewerProps } from "../types.js";

export const Viewer = (props: WebViewerProps) => {
  const initialized = useWebViewerInitializer(props);
  useEffect(() => {
    const handleBeforeUnload = async () => {
      Presentation.terminate();
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
