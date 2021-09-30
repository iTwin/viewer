/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useAccessToken } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React from "react";

import { SignIn } from "../signin/SignIn";
import { ModelViewer } from "../viewer/ModelViewer";

interface DownloadRouteParams {
  iTwinId: string;
  iModelId: string;
}

export const DownloadRoute = ({
  iTwinId,
  iModelId,
}: RouteComponentProps<DownloadRouteParams>) => {
  const accessToken = useAccessToken();

  if (accessToken) {
    return <ModelViewer iTwinId={iTwinId} iModelId={iModelId} />;
  } else {
    return <SignIn />;
  }
};
