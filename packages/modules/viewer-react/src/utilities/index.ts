/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ViewerProps } from "../components/BaseViewer";
import {
  iTwinViewerInitializerParamList,
  ItwinViewerInitializerParams,
} from "../types";

export * from "./MakeCancellable";

/**
 * Is the item an object?
 * @param item
 * @returns
 */
export const isObject = (item: any) => {
  return Object.prototype.toString.call(item) === "[object Object]";
};

/**
 * Is the item a function?
 * @param item
 * @returns
 */
export const isFunction = (item: any) => {
  return typeof item === "function";
};

/**
 * Are a and b equal (deep)?
 * @param a
 * @param b
 * @returns
 */
export const isEqual = (a?: any, b?: any) => {
  if (!a || !b) {
    return false;
  }
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const prop in a) {
    const objectCompare = isObject(a[prop]) && isObject(b[prop]);
    const functionCompare = isFunction(a[prop]) && isFunction(b[prop]);
    if (
      (objectCompare && !isEqual(a[prop], b[prop])) ||
      (functionCompare && a[prop].toString() !== b[prop].toString()) ||
      (!objectCompare && !functionCompare && a[prop] !== b[prop])
    ) {
      return false;
    }
  }
  return true;
};

/**
 * Pull out iTwin.js initialization options from a set of options
 * @param options
 * @returns
 */
export const getInitializationOptions = (options?: ViewerProps) => {
  const initOptions = {} as ItwinViewerInitializerParams;
  if (options) {
    for (const key in options) {
      if (iTwinViewerInitializerParamList.indexOf(key) >= 0) {
        initOptions[key] = options[key];
      }
    }
  }
  return initOptions;
};
