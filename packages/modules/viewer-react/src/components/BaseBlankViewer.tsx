/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BlankConnectionProps, IModelApp } from "@bentley/imodeljs-frontend";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React, { useEffect, useState } from "react";

import {
  BlankConnectionViewState,
  ItwinViewerCommonParams,
  ItwinViewerUi,
  ViewerExtension,
} from "../types";
import IModelLoader from "./iModel/IModelLoader";

export interface BlankViewerProps extends ItwinViewerCommonParams {
  blankConnection: BlankConnectionProps;
  viewStateOptions?: BlankConnectionViewState;
  extensions?: ViewerExtension[];
}

export const BaseBlankViewer: React.FC<BlankViewerProps> = ({
  extensions,
  appInsightsKey,
  theme,
  defaultUiConfig,
  onIModelConnected,
  frontstages,
  backstageItems,
  uiFrameworkVersion,
  viewportOptions,
  uiProviders,
  blankConnection,
  viewStateOptions,
}: BlankViewerProps) => {
  const [uiConfig, setUiConfig] = useState<ItwinViewerUi>();
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

  useEffect(() => {
    // hide the property grid and treeview by default, but allow to be overridden via props
    const defaultBlankViewerUiConfig: ItwinViewerUi = {
      hidePropertyGrid: true,
      hideTreeView: true,
    };
    const blankViewerUiConfig = {
      ...defaultBlankViewerUiConfig,
      ...defaultUiConfig,
    };
    setUiConfig(blankViewerUiConfig);
  }, [defaultUiConfig]);

  return (
    <ErrorBoundary>
      {authorized && (
        <IModelLoader
          defaultUiConfig={uiConfig}
          appInsightsKey={appInsightsKey}
          onIModelConnected={onIModelConnected}
          frontstages={frontstages}
          backstageItems={backstageItems}
          uiFrameworkVersion={uiFrameworkVersion}
          viewportOptions={viewportOptions}
          blankConnection={blankConnection}
          blankConnectionViewState={viewStateOptions}
          uiProviders={uiProviders}
          theme={theme}
          extensions={extensions}
        />
      )}
    </ErrorBoundary>
  );
};
