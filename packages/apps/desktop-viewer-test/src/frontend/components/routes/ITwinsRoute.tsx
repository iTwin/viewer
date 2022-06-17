/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useAccessToken } from "@itwin/desktop-viewer-react";
import React from "react";

import { SelectProject } from "../modelSelector";
import { SignIn } from "../signin/SignIn";

export const ITwinsRoute = () => {
  const accessToken = useAccessToken();

  if (accessToken) {
    return <SelectProject />;
  } else {
    return <SignIn />;
  }
};
