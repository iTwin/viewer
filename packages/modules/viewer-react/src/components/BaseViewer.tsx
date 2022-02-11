/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { FillCentered } from "@itwin/core-react";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React from "react";

import { useAccessToken } from "../hooks/useAccessToken";
import { useBaseViewerInitializer } from "../hooks/useBaseViewerInitializer";
import type { ItwinViewerCommonParams } from "../types";
import IModelLoader from "./iModel/IModelLoader";

export interface ViewerProps extends ItwinViewerCommonParams {
  iTwinId?: string;
  iModelId?: string;
  changeSetId?: string;
  snapshotPath?: string; // TODO next rename (filePath?) as this can be a briefcase or a snapshot
  loadingComponent?: React.ReactNode;
}

export const BaseViewer: React.FC<ViewerProps> = ({
  iModelId,
  iTwinId,
  appInsightsKey,
  theme,
  changeSetId,
  defaultUiConfig,
  onIModelConnected,
  productId,
  snapshotPath,
  frontstages,
  backstageItems,
  viewportOptions,
  uiProviders,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  additionalRpcInterfaces,
  viewCreatorOptions,
  loadingComponent,
  enablePerformanceMonitors,
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
      {snapshotPath || accessToken ? (
        viewerInitialized ? (
          <IModelLoader
            iTwinId={iTwinId}
            iModelId={iModelId}
            changeSetId={changeSetId}
            defaultUiConfig={defaultUiConfig}
            appInsightsKey={appInsightsKey}
            onIModelConnected={onIModelConnected}
            snapshotPath={snapshotPath}
            frontstages={frontstages}
            backstageItems={backstageItems}
            viewportOptions={viewportOptions}
            uiProviders={uiProviders}
            theme={theme}
            viewCreatorOptions={viewCreatorOptions}
            loadingComponent={loadingComponent}
          />
        ) : (
          <FillCentered>initializing...</FillCentered>
        )
      ) : (
        <FillCentered>Please sign in.</FillCentered>
      )}
    </ErrorBoundary>
  );
};
