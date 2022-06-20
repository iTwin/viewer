/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import { Route, Routes } from "react-router-dom";

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

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/logout" element={<LogoutRedirect />} />
      <Route path="/signin-callback" element={<LoginRedirect />} />
      <Route path="/viewer" element={<ViewerHome />} />
      <Route path="/blankconnection" element={<BlankConnectionHome />} />
      <Route path="/imodelbank" element={<IModelBankHome />} />
    </Routes>
  );
};
