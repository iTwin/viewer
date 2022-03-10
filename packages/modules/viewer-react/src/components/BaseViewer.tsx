/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { FillCentered } from "@itwin/core-react";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React from "react";

import { useAccessToken } from "../hooks/useAccessToken";
import { useBaseViewerInitializer } from "../hooks/useBaseViewerInitializer";
import type { ViewerProps } from "../types";
import IModelLoader from "./iModel/IModelLoader";

export const BaseViewer = ({
  appInsightsKey,
  productId,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  additionalRpcInterfaces,
  enablePerformanceMonitors,
  ...loaderProps
}: ViewerProps) => {
  const viewerInitialized = useBaseViewerInitializer({
    appInsightsKey,
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
      {/* {iModelLoaderProps?.filePath || */}
      {("filePath" in loaderProps && loaderProps.filePath) || accessToken ? (
        viewerInitialized ? (
          <IModelLoader appInsightsKey={appInsightsKey} {...loaderProps} />
        ) : (
          <FillCentered>initializing...</FillCentered>
        )
      ) : (
        <FillCentered>Please sign in.</FillCentered>
      )}
    </ErrorBoundary>
  );
};
