/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Route, Switch } from "react-router-dom";

async function loadHomeRoute() {
  return import(
    /* webpackChunkName: "route--home" */
    "../home/Home"
  );
}

async function loadLogoutRoute() {
  return import(
    /* webpackChunkName: "route--logout" */
    "../auth/LogoutRedirect"
  );
}

async function loadLoginRoute() {
  return import(
    /* webpackChunkName: "route--login" */
    "../auth/LoginRedirect"
  );
}

async function loadViewerRoute() {
  return import(
    /* webpackPrefetch: true, webpackChunkName: "route--viewer" */
    "../home/ViewerHome"
  );
}

async function loadBlankConnectionRoute() {
  return import(
    /* webpackChunkName: "route--blankconnection" */
    "../home/BlankConnectionHome"
  );
}

async function loadIModelBankRoute() {
  return import(
    /* webpackChunkName: "route--imodelbank" */
    "../home/IModelBankHome"
  );
}

const Home = React.lazy(loadHomeRoute);
const LoginRedirect = React.lazy(loadLoginRoute);
const LogoutRedirect = React.lazy(loadLogoutRoute);
const IModelBankHome = React.lazy(loadIModelBankRoute);
const BlankConnectionHome = React.lazy(loadBlankConnectionRoute);
const ViewerHome = React.lazy(loadViewerRoute);

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
