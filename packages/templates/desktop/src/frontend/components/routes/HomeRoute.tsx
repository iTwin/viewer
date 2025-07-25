/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";
import { SettingsContext } from "../../services/SettingsContext";
import Home from "../home/Home";

export const HomeRoute = () => {
  const navigate = useNavigate();
  const userSettings = useContext(SettingsContext);

  useEffect(() => {
    // must be initialized here (child of the Router) in order to use the navigate function
    ITwinViewerApp.initializeMenuListeners(navigate, userSettings.addRecent);
  }, [navigate, userSettings]);

  return <Home />;
};
