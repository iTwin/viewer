/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { RouteComponentProps, useNavigate } from "@reach/router";
import React, { useContext, useEffect } from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";
import { SettingsContext } from "../../services/SettingsClient";
import Home from "../home/Home";

//eslint-disable-next-line no-empty-pattern
export const HomeRoute = ({}: RouteComponentProps) => {
  const navigate = useNavigate();
  const userSettings = useContext(SettingsContext);

  useEffect(() => {
    // must be initialized here (child of the Router) in order to use the navigate function
    ITwinViewerApp.initializeMenuListeners(navigate, userSettings);
  }, []);

  return <Home />;
};
