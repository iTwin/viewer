/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Cartographic } from "@itwin/core-common";
import { Range3d } from "@itwin/core-geometry";
import { FillCentered } from "@itwin/core-react";
import React from "react";

import { useAccessToken } from "../hooks/useAccessToken";
import { useBaseViewerInitializer } from "../hooks/useBaseViewerInitializer";
import type { ViewerProps } from "../types";
import { ErrorBoundary } from "./error/ErrorBoundary";
import IModelLoader from "./iModel/IModelLoader";

export const BaseViewer = ({
  productId,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  additionalRpcInterfaces,
  enablePerformanceMonitors,
  ...loaderProps
}: ViewerProps) => {
  const viewerInitialized = useBaseViewerInitializer({
    productId,
    i18nUrlTemplate,
    onIModelAppInit,
    additionalI18nNamespaces,
    additionalRpcInterfaces,
    enablePerformanceMonitors,
  });

  const accessToken = useAccessToken();
  return (
    <ErrorBoundary>
      {loaderProps.filePath || accessToken ? (
        viewerInitialized ? (
          <IModelLoader
            blankConnection={{
              extents: new Range3d(0, 0, 0, 0, 0),
              location: Cartographic.createZero(),
              name: "name",
            }}
            iTwinId="asdsa"
            iModelId="sadaqsd"
          />
        ) : (
          <FillCentered>Initializing...</FillCentered>
        )
      ) : (
        <FillCentered>Please provide a valid access token.</FillCentered>
      )}
    </ErrorBoundary>
  );
};
