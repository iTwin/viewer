/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

declare global {
  var IMJS_URL_PREFIX: string; // eslint-disable-line no-var

  interface Window {
    ITWIN_VIEWER_HOME: string;
  }
}

export {};
