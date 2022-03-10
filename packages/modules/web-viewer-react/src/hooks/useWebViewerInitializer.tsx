/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ItwinViewerInitializerParams } from "@itwin/viewer-react";
import {
  getInitializationOptions,
  isEqual,
  useBaseViewerInitializer,
} from "@itwin/viewer-react";
import { useEffect, useMemo, useState } from "react";

import { WebInitializer } from "../services/Initializer";
import type { WebProps } from "../types";

export const useWebViewerInitializer = (options: WebProps) => {
  const [webViewerInitOptions, setWebViewerInitOptions] =
    useState<ItwinViewerInitializerParams>();
  const [webViewerInitalized, setWebViewerInitalized] = useState(false);
  const baseViewerInitialized = useBaseViewerInitializer(
    options,
    !webViewerInitalized
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
      setWebViewerInitalized(false);
      setWebViewerInitOptions(initializationOptions);
      void WebInitializer.startWebViewer(options).then(() => {
        void WebInitializer.initialized.then(() => {
          setWebViewerInitalized(true);
        });
      });
    }
  }, [options, webViewerInitOptions]);

  return baseViewerInitialized && webViewerInitalized;
};
