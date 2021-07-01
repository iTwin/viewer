/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export const appInfo = {
  id: "itwin-viewer",
  title: "iTwin Desktop Viewer",
  envPrefix: "ITWIN_VIEWER_",
};

export const getAppEnvVar = (varName: string): string | undefined =>
  process.env[`${appInfo.envPrefix}${varName}`];
