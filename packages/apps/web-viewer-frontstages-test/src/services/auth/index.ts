/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export const RedirectKey = "LoginRedirect";

/**
 * store the redirect path
 * @param path
 */
export const setLoginRedirect = (path: string) => {
  sessionStorage.setItem(RedirectKey, path);
};

export * from "./AuthorizationClient";
