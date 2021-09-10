/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IpcApp } from "@bentley/imodeljs-frontend";
import { RouteComponentProps, useNavigate } from "@reach/router";
import React, { useEffect } from "react";

import { channelName } from "../../../common/ViewerConfig";
import { ITwinViewerApp } from "../../app/ITwinViewerApp";
import Home from "../home/Home";

//eslint-disable-next-line no-empty-pattern
export const HomeRoute = ({}: RouteComponentProps) => {
  const navigate = useNavigate();
  // TODO Kevin move this
  useEffect(() => {
    IpcApp.addListener(channelName, async (sender, arg) => {
      if (arg === "snapshot") {
        const snapshotPath = await ITwinViewerApp.getSnapshotFile();
        if (snapshotPath) {
          await navigate(`/snapshot`, { state: { snapshotPath } });
        }
      } else if (arg === "remote") {
        await navigate("/itwins");
      }
    });
  }, []);

  return <Home />;
};
