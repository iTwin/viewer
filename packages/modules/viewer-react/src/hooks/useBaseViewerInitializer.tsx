/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useEffect, useMemo, useState } from "react";

import { BaseInitializer } from "../services/BaseInitializer";
import type { ViewerCommonProps } from "../types";
import { getInitializationOptions, isEqual } from "../utilities";
import { useIsMounted } from "./useIsMounted";

export const useBaseViewerInitializer = (
  options?: ViewerCommonProps,
  delay?: boolean
) => {
  const [baseViewerInitOptions, setBaseViewerInitOptions] =
    useState<ViewerCommonProps>();
  const [baseViewerInitialized, setBaseViewerInitialized] = useState(false);
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
      setBaseViewerInitialized(false);
      void BaseInitializer.initialize(options).then(() => {
        void BaseInitializer.initialized.then(() => {
          setBaseViewerInitialized(true);
        });
      });
    }
    if (!isMounted.current) {
      return BaseInitializer.cancel();
    }
  }, [options, delay, baseViewerInitOptions, initializationOptions, isMounted]);

  return baseViewerInitialized;
};
