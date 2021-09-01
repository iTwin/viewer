/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { RouteComponentProps } from "@reach/router";
import React from "react";

import Home from "../home/Home";

export const HomeRoute = ({}: RouteComponentProps) => {
  return <Home />;
};
