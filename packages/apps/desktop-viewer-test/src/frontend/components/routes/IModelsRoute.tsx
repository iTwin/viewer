/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useAccessToken } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { SelectIModel } from "../modelSelector/SelectIModel";
import { SignIn } from "../signin/SignIn";

interface IModelsRouteParams {
  iTwinId?: string;
}

export const IModelsRoute = ({
  iTwinId,
}: RouteComponentProps<IModelsRouteParams>) => {
  const accessToken = useAccessToken();

  if (accessToken) {
    return (
      <SelectIModel
        accessToken={accessToken.toTokenString()}
        projectId={iTwinId}
      />
    );
  } else {
    return <SignIn />;
  }
};