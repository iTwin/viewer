/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer, useIsMounted } from "@itwin/viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { WebInitializer } from "../services/Initializer";
import { WebViewerProps } from "../types";

export const Viewer = (props: WebViewerProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const memoizedProps = useMemo(() => {
    return { ...props };
  }, [props]);
  const isMounted = useIsMounted();

  useEffect(() => {
    void WebInitializer.startWebViewer(memoizedProps).then(() => {
      void WebInitializer.initialized
        .then(() => setInitialized(true))
        .catch((error) => {
          if (error === "Web Startup Cancelled") {
            // canceled from previous dismount. Not a true error
            console.log(error);
          } else {
            throw error;
          }
        });
    });
    return () => {
      if (!isMounted.current) {
        WebInitializer.cancel();
      }
    };
  }, [memoizedProps, isMounted]);

  return initialized ? <BaseViewer {...props} /> : null; //TODO loader?
};
