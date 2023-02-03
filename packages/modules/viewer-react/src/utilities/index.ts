/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import isEqual from "lodash.isequal";

import type { ViewerCommonProps, ViewerInitializerParams } from "../types";
import { iTwinViewerInitializerParamList } from "../types";

export { isEqual };

export * from "./MakeCancellable";

/**
 * Pull out iTwin.js initialization options from a set of options
 * @param options
 * @returns
 */
export const getInitializationOptions = (options?: ViewerCommonProps) => {
  const initOptions = {};
  if (options) {
    for (const key of iTwinViewerInitializerParamList) {
      if ((options as any)[key]) {
        (initOptions as any)[key] = (options as any)[key];
      }
    }
  }
  return initOptions as ViewerInitializerParams;
};
