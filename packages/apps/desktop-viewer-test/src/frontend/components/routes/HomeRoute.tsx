/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { RouteComponentProps, useNavigate } from "@reach/router";
import React from "react";

import { useMenuHandlers } from "../../hooks";
import Home from "../home/Home";

//eslint-disable-next-line no-empty-pattern
export const HomeRoute = ({}: RouteComponentProps) => {
  const navigate = useNavigate();
  useMenuHandlers(navigate);
  return <Home />;
};
