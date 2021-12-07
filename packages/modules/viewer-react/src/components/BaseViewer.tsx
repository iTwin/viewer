/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import { FillCentered } from "@bentley/ui-core/lib/ui-core";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React, { useEffect, useState } from "react";

import { useBaseViewerInitializer } from "../hooks";
import { ItwinViewerCommonParams } from "../types";
import IModelLoader from "./iModel/IModelLoader";

export interface ViewerProps extends ItwinViewerCommonParams {
  contextId?: string;
  iModelId?: string;
  changeSetId?: string;
  snapshotPath?: string; // TODO 3.0 rename (filePath?) as this can be a briefcase or a snapshot
  loadingComponent?: React.ReactNode;
}

export const BaseViewer: React.FC<ViewerProps> = ({
  iModelId,
  contextId,
  appInsightsKey,
  theme,
  changeSetId,
  defaultUiConfig,
  onIModelConnected,
  productId,
  snapshotPath,
  frontstages,
  backstageItems,
  uiFrameworkVersion,
  viewportOptions,
  uiProviders,
  imjsAppInsightsKey,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  additionalRpcInterfaces,
  viewCreatorOptions,
  loadingComponent,
}: ViewerProps) => {
  // assume authorized when using a local snapshot TODO poor assumption
  const [authorized, setAuthorized] = useState(!!snapshotPath);
  const viewerInitialized = useBaseViewerInitializer({
    appInsightsKey,
    productId,
    imjsAppInsightsKey,
    i18nUrlTemplate,
    onIModelAppInit,
    additionalI18nNamespaces,
    additionalRpcInterfaces,
  });
  useEffect(() => {
    // assume authorized when using a local snapshot
    if (snapshotPath) {
      setAuthorized(true);
    } else {
      setAuthorized(
        (IModelApp.authorizationClient?.hasSignedIn &&
          IModelApp.authorizationClient?.isAuthorized) ||
          false
      );
      IModelApp.authorizationClient?.onUserStateChanged.addListener(() => {
        setAuthorized(
          (IModelApp.authorizationClient?.hasSignedIn &&
            IModelApp.authorizationClient?.isAuthorized) ||
            false
        );
      });
    }
  }, [snapshotPath]);

  return (
    <ErrorBoundary>
      {authorized ? (
        viewerInitialized ? (
          <IModelLoader
            contextId={contextId}
            iModelId={iModelId}
            changeSetId={changeSetId}
            defaultUiConfig={defaultUiConfig}
            appInsightsKey={appInsightsKey}
            onIModelConnected={onIModelConnected}
            snapshotPath={snapshotPath}
            frontstages={frontstages}
            backstageItems={backstageItems}
            uiFrameworkVersion={uiFrameworkVersion}
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
