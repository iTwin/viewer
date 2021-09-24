/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useAccessToken } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React, { useEffect, useState } from "react";

import { SelectIModel } from "../modelSelector/SelectIModel";
import { SignIn } from "../signin/SignIn";

interface IModelsRouteParams {
  iTwinId?: string;
}
interface IModelsRouteState {
  projectName?: string;
}

export const IModelsRoute = ({
  iTwinId,
  location,
}: RouteComponentProps<IModelsRouteParams>) => {
  const [projectName, setProjectName] = useState<string>();
  const accessToken = useAccessToken();

  useEffect(() => {
    const routeState = location?.state as IModelsRouteState | undefined;
    if (routeState?.projectName) {
      setProjectName(routeState?.projectName);
    }
  }, [location?.state]);

  if (accessToken) {
    return (
      <SelectIModel
        accessToken={accessToken.toTokenString()}
        projectId={iTwinId}
        projectName={projectName}
      />
    );
  } else {
    return <SignIn />;
  }
};
