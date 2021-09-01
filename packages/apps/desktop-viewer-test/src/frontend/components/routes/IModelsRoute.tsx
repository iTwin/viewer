/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelApp } from "@bentley/imodeljs-frontend";
import { AccessToken } from "@bentley/itwin-client";
import { DesktopInitializer } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React, { useCallback, useEffect, useState } from "react";

import store from "../../app/store";
import { SelectProject } from "../modelSelector";
import { SelectIModel } from "../modelSelector/SelectIModel";
import { SignIn } from "../signin/SignIn";

interface IModelsRouteParams {
  projectId?: string;
}

// TODO Kevin cleanup
export const IModelsRoute = ({
  projectId,
}: RouteComponentProps<IModelsRouteParams>) => {
  // const [isAuthorized, setIsAuthorized] = useState(
  //   IModelApp.authorizationClient?.isAuthorized
  // );
  const [accessToken, setAccessToken] = useState<AccessToken>();

  // const onSignedIn = () => {
  //   setIsAuthorized(true);
  // };

  const getAccessToken = useCallback(async () => {
    const token = await IModelApp.authorizationClient?.getAccessToken();
    setAccessToken(token);
  }, []);

  useEffect(() => {
    void getAccessToken();
  }, [getAccessToken]);

  useEffect(() => {
    IModelApp?.authorizationClient?.onUserStateChanged.addListener((token) => {
      //   setIsAuthorized(IModelApp.authorizationClient?.isAuthorized || false);
      setAccessToken(token);
    });
  }, []);

  if (accessToken) {
    return (
      <SelectIModel
        accessToken={accessToken.toTokenString()}
        projectId={projectId}
      />
    );
  } else {
    return <SignIn />;
  }
};
