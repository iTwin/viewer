/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelApp } from "@bentley/imodeljs-frontend";
import { AccessToken } from "@bentley/itwin-client";
import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React, { useCallback, useEffect, useState } from "react";

import store from "../../app/store";
import { SelectProject } from "../modelSelector";
import { SignIn } from "../signin/SignIn";

// TODO Kevin cleanup
interface ProjectsRouteProps extends RouteComponentProps {
  children?: any;
}
export const ProjectsRoute = ({}: ProjectsRouteProps) => {
  // const [isAuthorized, setIsAuthorized] = useState(
  //   IModelApp.authorizationClient?.isAuthorized
  // );
  const [accessToken, setAccessToken] = useState<AccessToken>();
  //const initialized = useDesktopViewerInitializer();

  // const onSignedIn = () => {
  //   setIsAuthorized(true);
  // };

  const getAccessToken = useCallback(async () => {
    // if (initialized) {
    const token = await IModelApp.authorizationClient?.getAccessToken();
    setAccessToken(token);
    // }
  }, []);

  useEffect(() => {
    void getAccessToken();
  }, [getAccessToken]);

  useEffect(() => {
    // if (initialized) {
    // IModelApp?.authorizationClient?.onUserStateChanged.addListener(() => {
    //   setIsAuthorized(IModelApp.authorizationClient?.isAuthorized || false);
    // });
    IModelApp?.authorizationClient?.onUserStateChanged.addListener((token) => {
      //   setIsAuthorized(IModelApp.authorizationClient?.isAuthorized || false);
      setAccessToken(token);
    });
    // }
  }, []);

  if (accessToken) {
    return <SelectProject />;
  } else {
    return <SignIn />;
  }
};
