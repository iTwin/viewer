/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BlankConnectionProps, IModelApp } from "@bentley/imodeljs-frontend";
import { FillCentered } from "@bentley/ui-core/lib/ui-core";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React, { useEffect, useState } from "react";

import { useBaseViewerInitializer } from "../hooks";
import {
  BlankConnectionViewState,
  ItwinViewerCommonParams,
  ItwinViewerUi,
} from "../types";
import IModelLoader from "./iModel/IModelLoader";

export interface BlankViewerProps extends ItwinViewerCommonParams {
  blankConnection: BlankConnectionProps;
  viewStateOptions?: BlankConnectionViewState;
}

export const BaseBlankViewer: React.FC<BlankViewerProps> = ({
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
  productId,
  imjsAppInsightsKey,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  additionalRpcInterfaces,
}: BlankViewerProps) => {
  const [uiConfig, setUiConfig] = useState<ItwinViewerUi>();
  const [authorized, setAuthorized] = useState(false);
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
      {authorized ? (
        viewerInitialized ? (
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
