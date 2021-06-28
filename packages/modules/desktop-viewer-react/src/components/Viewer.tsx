/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer, useIsMounted } from "@itwin/viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { DesktopInitializer } from "../services/Initializer";
import { DesktopViewerProps } from "../types";

export const Viewer = (props: DesktopViewerProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const memoizedProps = useMemo(() => {
    return { ...props };
  }, [props]);
  const isMounted = useIsMounted();

  useEffect(() => {
    void DesktopInitializer.startDesktopViewer(memoizedProps).then(() => {
      void DesktopInitializer.initialized
        .then(() => setInitialized(true))
        .catch((error) => {
          if (error === "Desktop Startup Cancelled") {
            // canceled from previous dismount. Not a true error
            console.log(error);
          } else {
            throw error;
          }
        });
    });
    return () => {
      if (!isMounted.current) {
        DesktopInitializer.cancel();
      }
    };
  }, [memoizedProps, isMounted]);

  return initialized ? <BaseViewer {...memoizedProps} /> : null; //TODO loader?
};
