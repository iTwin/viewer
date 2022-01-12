/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Route, Switch } from "react-router-dom";

import { LoginRedirect, LogoutRedirect } from "../auth";
import { BlankConnectionHome, Home, ViewerHome } from "../home";
import { IModelBankHome } from "../home/IModelBankHome";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/logout" exact={true} component={LogoutRedirect} />
      <Route path="/signin-callback" exact={true} component={LoginRedirect} />
      <Route path="/viewer" exact={true} component={ViewerHome} />
      <Route
        path="/blankconnection"
        exact={true}
        component={BlankConnectionHome}
      />
      <Route path="/imodelbank" exact={true} component={IModelBankHome} />
    </Switch>
  );
};
