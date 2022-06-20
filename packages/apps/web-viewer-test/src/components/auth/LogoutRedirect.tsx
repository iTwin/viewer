/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Navigate } from "react-router-dom";

import { RedirectKey } from "../../services/auth";

const LogoutRedirect = () => {
  const redirectPath = sessionStorage.getItem(RedirectKey) ?? "/";
  return <Navigate to={redirectPath} />;
};

export default LogoutRedirect;
