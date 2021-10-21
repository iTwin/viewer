/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseBlankViewer } from "@itwin/viewer-react-3.0";
import React, { useEffect, useMemo, useState } from "react";

import { WebInitializer } from "../services/Initializer";
import { WebBlankViewerProps } from "../types";

export const BlankViewer = (props: WebBlankViewerProps) => {
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

  return initialized ? <BaseBlankViewer {...props} /> : null; //TODO loader?
};
