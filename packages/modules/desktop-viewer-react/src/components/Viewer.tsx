/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BaseViewer, useIsMounted } from "@itwin/viewer-react";
import React, { useEffect, useMemo, useState } from "react";

import { useDesktopViewerInitializer } from "../hooks";
import { DesktopInitializer } from "../services/Initializer";
import { DesktopViewerProps } from "../types";

// TODO Kevin cleanup
export const Viewer = (props: DesktopViewerProps) => {
  // const [viewerInitialized, setViewerInitialized] = useState<boolean>(false);
  const memoizedProps = useMemo(() => {
    return { ...props };
  }, [props]);

  const memoizedInitProps = useMemo(() => {
    const initProps = { ...memoizedProps };
    delete initProps.changeSetId;
    delete initProps.contextId;
    delete initProps.iModelId;
    delete initProps.snapshotPath;
    return initProps;
  }, [props]);
  // const isMounted = useIsMounted();
  const initialized = useDesktopViewerInitializer(memoizedInitProps);
  // useEffect(() => {
  //   void DesktopInitializer.startDesktopViewer(memoizedProps).then(() => {
  //     void DesktopInitializer.initialized
  //       .then(() => setInitialized(true))
  //       .catch((error) => {
  //         if (error === "Desktop Startup Cancelled") {
  //           // canceled from previous dismount. Not a true error
  //           console.log(error);
  //         } else {
  //           throw error;
  //         }
  //       });
  //   });
  //   return () => {
  //     if (!isMounted.current) {
  //       DesktopInitializer.cancel();
  //     }
  //   };
  // }, [memoizedProps, isMounted]);

  return initialized ? <BaseViewer {...memoizedProps} /> : null; //TODO loader?
};
