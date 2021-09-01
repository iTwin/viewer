/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";

import { useBaseViewerInitializer } from "../../../viewer-react/lib";
import { DesktopInitializer } from "../services/Initializer";
import { DesktopViewerProps } from "../types";

// TODO Kevin cleanup
export const useDesktopViewerInitializer = (options?: DesktopViewerProps) => {
  const [desktopViewerInitOptions, setDesktopViewerInitOptions] =
    useState<DesktopViewerProps>();
  const [desktopViewerInitalized, setDesktopViewerInitalized] = useState(false);
  const baseViewerInitialized = useBaseViewerInitializer(
    options,
    !desktopViewerInitalized
  );
  useEffect(() => {
    if (!desktopViewerInitOptions || options !== desktopViewerInitOptions) {
      //TODO omit imodelid, snapshotPath, etc.?
      setDesktopViewerInitalized(false);
      setDesktopViewerInitOptions(options);
      DesktopInitializer.cancel(); //TODO rename stopDesktopInitalizer
      void DesktopInitializer.startDesktopViewer(options).then(() => {
        void DesktopInitializer.initialized.then(() => {
          setDesktopViewerInitalized(true);
        });
      });
    }
  }, [options, desktopViewerInitOptions]);

  return baseViewerInitialized && desktopViewerInitalized;
};
