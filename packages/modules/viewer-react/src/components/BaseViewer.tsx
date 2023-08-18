/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { FillCentered } from "@itwin/core-react";
import React from "react";

import { useAccessToken } from "../hooks/useAccessToken";
import { useBaseViewerInitializer } from "../hooks/useBaseViewerInitializer";
import type { ViewerProps } from "../types";
import { ErrorBoundary } from "./error/ErrorBoundary";
import IModelLoader from "./iModel/IModelLoader";
import { BackstageAppButton, UiItemsManager } from "@itwin/appui-react";

export const BaseViewer = ({
  productId,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  enablePerformanceMonitors,
  ...loaderProps
}: ViewerProps) => {
  const viewerInitialized = useBaseViewerInitializer({
    productId,
    i18nUrlTemplate,
    onIModelAppInit,
    additionalI18nNamespaces,
    enablePerformanceMonitors,
  });

  const accessToken = useAccessToken();
  const hasBackstageItems = loaderProps.backstageItems ? (loaderProps.backstageItems.length > 0 || UiItemsManager.getBackstageItems().length > 0) : UiItemsManager.getBackstageItems().length > 0;
  const cornerButton = hasBackstageItems ? <BackstageAppButton /> : undefined
  return (
    <ErrorBoundary>
      {loaderProps.filePath || accessToken ? (
        viewerInitialized ? (
          <IModelLoader defaultUiConfig={{cornerButton}} {...loaderProps}  />
        ) : (
          <FillCentered>Initializing...</FillCentered>
        )
      ) : (
        <FillCentered>Please provide a valid access token.</FillCentered>
      )}
    </ErrorBoundary>
  );
};
