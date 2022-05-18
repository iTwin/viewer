/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Redirect } from "react-router-dom";

import { RedirectKey } from "../../services/auth";

const LogoutRedirect = () => {
  const redirectPath = sessionStorage.getItem(RedirectKey) ?? "/";
  return (
    <div>
      <Redirect to={redirectPath} />
    </div>
  );
};

export default LogoutRedirect;
