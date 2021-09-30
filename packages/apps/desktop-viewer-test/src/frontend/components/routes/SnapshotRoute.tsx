/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { RouteComponentProps } from "@reach/router";
import React, { useEffect, useState } from "react";

import { ModelViewer } from "../viewer/ModelViewer";

interface SnapshotRouteProps extends RouteComponentProps {
  children?: any;
}

interface SnapshotRouteState {
  snapshotPath?: string;
}

export const SnapshotRoute = ({ location }: SnapshotRouteProps) => {
  const [snapshotPath, setSnapshotPath] = useState<string>();

  useEffect(() => {
    const routeState = location?.state as SnapshotRouteState | undefined;
    if (routeState?.snapshotPath) {
      setSnapshotPath(routeState?.snapshotPath);
    }
  }, [location?.state]);

  return snapshotPath ? <ModelViewer snapshotPath={snapshotPath} /> : null;
};
