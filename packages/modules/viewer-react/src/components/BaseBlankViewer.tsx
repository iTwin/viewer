/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BlankConnectionProps, IModelApp } from "@bentley/imodeljs-frontend";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React, { useEffect, useState } from "react";

import { BaseInitializer } from "../services/BaseInitializer";
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
  const [iModelJsInitialized, setIModelJsInitialized] = useState(false);

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

  useEffect(() => {
    if (!iModelJsInitialized) {
      BaseInitializer.initialize({
        appInsightsKey,
        productId,
        imjsAppInsightsKey,
        i18nUrlTemplate,
        onIModelAppInit,
        additionalI18nNamespaces,
        additionalRpcInterfaces,
      })
        .then(() => {
          BaseInitializer.initialized
            .then(() => setIModelJsInitialized(true))
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          throw error;
        });
    }
    return BaseInitializer.cancel;
  }, [
    appInsightsKey,
    productId,
    imjsAppInsightsKey,
    i18nUrlTemplate,
    onIModelAppInit,
    additionalI18nNamespaces,
    additionalRpcInterfaces,
  ]);

  return (
    <ErrorBoundary>
      {authorized && iModelJsInitialized && (
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
      )}
    </ErrorBoundary>
  );
};
