/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ViewerInitializerParams } from "@itwin/viewer-react";
import {
  getInitializationOptions,
  isEqual,
  useBaseViewerInitializer,
} from "@itwin/viewer-react";
import { useEffect, useMemo, useState } from "react";

import { WebInitializer } from "../services/Initializer.js";
import type { WebViewerProps } from "../types.js";

export const useWebViewerInitializer = (options: WebViewerProps) => {
  const [webViewerInitOptions, setWebViewerInitOptions] =
    useState<ViewerInitializerParams>();
  const [webViewerInitialized, setWebViewerInitialized] = useState(false);
  const baseViewerInitialized = useBaseViewerInitializer(
    options,
    !webViewerInitialized
  );

  // only re-initialize when initialize options change
  const initializationOptions = useMemo(
    () => getInitializationOptions(options),
    [options]
  );

  useEffect(() => {
    if (
      !webViewerInitOptions ||
      !isEqual(initializationOptions, webViewerInitOptions)
    ) {
      setWebViewerInitialized(false);
      setWebViewerInitOptions(initializationOptions);
      void WebInitializer.startWebViewer(options).then(() => {
        void WebInitializer.initialized.then(() => {
          setWebViewerInitialized(true);
        });
      });
    }
  }, [options, webViewerInitOptions, initializationOptions]);

  return baseViewerInitialized && webViewerInitialized;
};
