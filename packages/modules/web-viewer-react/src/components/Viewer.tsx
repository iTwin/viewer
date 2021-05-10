/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer } from "@itwin/viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { WebInitializer } from "../services/Initializer";
import { WebViewerProps } from "../types";

export const Viewer = (props: WebViewerProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const memoizedProps = useMemo(() => {
    return { ...props };
  }, [props]);

  useEffect(() => {
    void WebInitializer.startWebViewer(memoizedProps).then(() => {
      void WebInitializer.initialized.then(() => {
        setInitialized(true);
      });
    });
    return WebInitializer.cancel;
  }, [memoizedProps]);

  return initialized ? <BaseViewer {...props} /> : null; //TODO loader?
};
