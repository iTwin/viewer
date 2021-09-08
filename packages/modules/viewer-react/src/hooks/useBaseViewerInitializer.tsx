/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useEffect, useMemo, useState } from "react";

import { ViewerProps } from "../components/BaseViewer";
import { BaseInitializer } from "../services/BaseInitializer";
import { getInitializationOptions, isEqual } from "../utilities";
import { useIsMounted } from "./";

export const useBaseViewerInitializer = (
  options?: ViewerProps,
  delay?: boolean
) => {
  const [baseViewerInitOptions, setBaseViewerInitOptions] =
    useState<ViewerProps>();
  const [baseViewerInitalized, setBaseViewerInitalized] = useState(false);
  const isMounted = useIsMounted();

  // only re-initialize when initialize options change
  const initializationOptions = useMemo(
    () => getInitializationOptions(options),
    [options]
  );

  useEffect(() => {
    if (
      !delay &&
      (!baseViewerInitOptions ||
        !isEqual(initializationOptions, baseViewerInitOptions))
    ) {
      setBaseViewerInitOptions(initializationOptions);
      setBaseViewerInitalized(false);
      void BaseInitializer.initialize(options).then(() => {
        void BaseInitializer.initialized.then(() => {
          setBaseViewerInitalized(true);
        });
      });
    }
    if (!isMounted.current) {
      return BaseInitializer.cancel(); //TODO rename stopDesktopInitalizer
    }
  }, [options, delay, baseViewerInitOptions]);

  return baseViewerInitalized;
};
