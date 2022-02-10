/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Route, Switch } from "react-router-dom";

import { LoginRedirect, LogoutRedirect } from "../auth";
import { Home } from "../home";
import MultiViewportApp from "../multi-viewport/MultiViewportApp";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/logout" exact={true} component={LogoutRedirect} />
      <Route path="/signin-callback" exact={true} component={LoginRedirect} />
      <Route path="/multi-viewport" exact={true} component={MultiViewportApp} />
    </Switch>
  );
};
