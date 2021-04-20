/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React, { useEffect, useState } from "react";

import { ItwinViewerCommonParams } from "../types";
import IModelLoader from "./iModel/IModelLoader";

export interface ViewerProps extends ItwinViewerCommonParams {
  contextId?: string;
  iModelId?: string;
  changeSetId?: string;
  snapshotPath?: string;
}

export const BaseViewer: React.FC<ViewerProps> = ({
  extensions,
  iModelId,
  contextId,
  appInsightsKey,
  theme,
  changeSetId,
  defaultUiConfig,
  onIModelConnected,
  snapshotPath,
  frontstages,
  backstageItems,
  uiFrameworkVersion,
  viewportOptions,
  uiProviders,
}: ViewerProps) => {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setAuthorized(
      (IModelApp.authorizationClient?.hasSignedIn &&
        IModelApp.authorizationClient?.isAuthorized) ||
        false
    );
    IModelApp.authorizationClient?.onUserStateChanged.addListener(() => {
      setAuthorized(
        (IModelApp.authorizationClient &&
          IModelApp.authorizationClient.hasSignedIn &&
          IModelApp.authorizationClient.isAuthorized) ||
          false
      );
    });
  }, []);

  // TODO not signed in message
  return (
    <ErrorBoundary>
      {authorized && (
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
          extensions={extensions}
        />
      )}
    </ErrorBoundary>
  );
};
