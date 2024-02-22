/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@itwin/core-frontend";
import { ITwinLocalization } from "@itwin/core-i18n";
import { FillCentered } from "@itwin/core-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useAccessToken } from "../hooks/useAccessToken";
import { useBaseViewerInitializer } from "../hooks/useBaseViewerInitializer";
import { getIModelAppOptions } from "../services/BaseInitializer";
import type { ViewerProps } from "../types";
import { ErrorBoundary } from "./error/ErrorBoundary";
import IModelLoader from "./iModel/IModelLoader";

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
          <FillCentered>
            {IModelApp.localization.getLocalizedString(
              "iTwinViewer:baseViewerInitializer.baseViewerInitializing"
            )}
          </FillCentered>
        )
      ) : (
        <FillCentered>
          {IModelApp.localization.getLocalizedString(
            "iTwinViewer:baseViewerInitializer.validTokenNeeded"
          )}
        </FillCentered>
      )}
    </ErrorBoundary>
  );
};
