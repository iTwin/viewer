/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@itwin/core-frontend";
import { Flex } from "@itwin/itwinui-react";
import React from "react";

import { useAccessToken } from "../hooks/useAccessToken.js";
import { useBaseViewerInitializer } from "../hooks/useBaseViewerInitializer.js";
import type { ViewerProps } from "../types.js";
import { ErrorBoundary } from "./error/ErrorBoundary.js";
import IModelLoader from "./iModel/IModelLoader.js";

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
  const isBlankConnection =
    loaderProps.extents && loaderProps.location && !loaderProps.iTwinId;

  return (
    <ErrorBoundary>
      {loaderProps.filePath || accessToken || isBlankConnection ? (
        viewerInitialized ? (
          <IModelLoader {...loaderProps} />
        ) : (
          <Flex>
            {IModelApp.localization.getLocalizedString(
              "iTwinViewer:baseViewerInitializer.baseViewerInitializing"
            )}
          </Flex>
        )
      ) : (
        <Flex>
          {IModelApp.localization.getLocalizedString(
            "iTwinViewer:baseViewerInitializer.validTokenNeeded"
          )}
        </Flex>
      )}
    </ErrorBoundary>
  );
};
