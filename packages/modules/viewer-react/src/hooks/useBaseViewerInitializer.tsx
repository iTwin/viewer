/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";

import { ViewerProps } from "../components/BaseViewer";
import { BaseInitializer } from "../services/BaseInitializer";

export const useBaseViewerInitializer = (
  options?: ViewerProps,
  delay?: boolean
) => {
  const [baseViewerInitOptions, setBaseViewerInitOptions] =
    useState<ViewerProps>();
  const [baseViewerInitalized, setBaseViewerInitalized] = useState(false);

  // TODO Kevin recursive??
  const isEqual = (newOptions?: any, currentOptions?: any) => {
    if (!newOptions || !currentOptions) {
      return false;
    }
    const currentProps = Object.keys(currentOptions);
    const newProps = Object.keys(newOptions);
    if (currentProps.length !== newProps.length) {
      return false;
    }

    for (const prop of currentProps) {
      if (currentOptions[prop] !== newOptions[prop]) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (
      !delay &&
      (!baseViewerInitOptions || !isEqual(options, baseViewerInitOptions))
    ) {
      //TODO omit imodelid, snapshotPath, etc.?
      setBaseViewerInitOptions(options);
      setBaseViewerInitalized(false);
      BaseInitializer.cancel(); //TODO rename stopDesktopInitalizer
      void BaseInitializer.initialize(options).then(() => {
        void BaseInitializer.initialized.then(() => {
          setBaseViewerInitalized(true);
        });
      });
    }
  }, [options, delay, baseViewerInitOptions]);

  return baseViewerInitalized;
};
