/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React, { useEffect, useState } from "react";

import { useIsMounted } from "../hooks";
import { BaseInitializer } from "../services/BaseInitializer";
import { ItwinViewerCommonParams } from "../types";
import IModelLoader from "./iModel/IModelLoader";

export interface ViewerProps extends ItwinViewerCommonParams {
  contextId?: string;
  iModelId?: string;
  changeSetId?: string;
  snapshotPath?: string;
}

export const BaseViewer: React.FC<ViewerProps> = ({
  iModelId,
  contextId,
  appInsightsKey,
  backend,
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
}: ViewerProps) => {
  const [authorized, setAuthorized] = useState(false);
  const [iModelJsInitialized, setIModelJsInitialized] = useState(false);
  const isMounted = useIsMounted();

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
    if (!iModelJsInitialized) {
      void BaseInitializer.initialize({
        appInsightsKey,
        backend,
        productId,
        imjsAppInsightsKey,
        i18nUrlTemplate,
        onIModelAppInit,
        additionalI18nNamespaces,
        additionalRpcInterfaces,
      }).then(() => {
        void BaseInitializer.initialized
          .then(() => setIModelJsInitialized(true))
          .catch((error) => {
            if (error === "Cancelled") {
              // canceled from previous dismount. Not a true error
              console.log(error);
            } else {
              throw error;
            }
          });
      });
    }
    if (!isMounted.current) {
      return BaseInitializer.cancel;
    }
  }, [
    appInsightsKey,
    backend,
    productId,
    imjsAppInsightsKey,
    i18nUrlTemplate,
    additionalI18nNamespaces,
    additionalRpcInterfaces,
    isMounted,
    iModelJsInitialized,
    onIModelAppInit,
  ]);

  // TODO not signed in message / loader
  return (
    <ErrorBoundary>
      {authorized && iModelJsInitialized && (
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
        />
      )}
    </ErrorBoundary>
  );
};
