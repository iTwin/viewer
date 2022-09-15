/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ViewerInitializerParams } from "@itwin/viewer-react";
import { useIsMounted } from "@itwin/viewer-react";
import {
  getInitializationOptions,
  isEqual,
  useBaseViewerInitializer,
} from "@itwin/viewer-react";
import { useEffect, useMemo, useState } from "react";

import { WebInitializer } from "../services/Initializer";
import type { WebViewerProps } from "../types";

export const useWebViewerInitializer = (options: WebViewerProps) => {
  const [viewerInitializerParams, setViewerInitializerParams] =
    useState<ViewerInitializerParams>();
  const [webViewerInitalized, setWebViewerInitalized] = useState(false);
  const baseViewerInitialized = useBaseViewerInitializer(
    options,
    !webViewerInitalized
  );
  const isMounted = useIsMounted();

  // only re-initialize when initialization options (ViewerInitializerParams) change
  const initializationOptions = useMemo(
    () => getInitializationOptions(options),
    [options]
  );

  useEffect(() => {
    if (
      !viewerInitializerParams ||
      !isEqual(initializationOptions, viewerInitializerParams)
    ) {
      setWebViewerInitalized(false);
      setViewerInitializerParams(initializationOptions);
      void WebInitializer.startWebViewer(options).then(() => {
        void WebInitializer.initialized.then(() => {
          setWebViewerInitalized(true);
        });
      });
    }
    if (!isMounted.current) {
      return WebInitializer.cancel();
    }
  }, [options, viewerInitializerParams, initializationOptions, isMounted]);

  return baseViewerInitialized && webViewerInitalized;
};
