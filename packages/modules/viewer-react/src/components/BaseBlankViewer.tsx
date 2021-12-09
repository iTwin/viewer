/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BlankConnectionProps } from "@itwin/core-frontend";
import { FillCentered } from "@itwin/core-react";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React, { useMemo } from "react";

import { useAccessToken, useBaseViewerInitializer } from "../hooks";
import type {
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
  viewportOptions,
  uiProviders,
  blankConnection,
  viewStateOptions,
  productId,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  additionalRpcInterfaces,
  enablePerformanceMonitors,
}: BlankViewerProps) => {
  const viewerInitialized = useBaseViewerInitializer({
    appInsightsKey,
    productId,
    i18nUrlTemplate,
    onIModelAppInit,
    additionalI18nNamespaces,
    additionalRpcInterfaces,
    enablePerformanceMonitors,
  });

  const uiConfig = useMemo<ItwinViewerUi>(() => {
    // hide the property grid and treeview by default, but allow to be overridden via props
    const defaultBlankViewerUiConfig: ItwinViewerUi = {
      hidePropertyGrid: true,
      hideTreeView: true,
    };
    return {
      ...defaultBlankViewerUiConfig,
      ...defaultUiConfig,
    };
  }, [defaultUiConfig]);

  const accessToken = useAccessToken();

  return (
    <ErrorBoundary>
      {accessToken ? (
        viewerInitialized ? (
          <IModelLoader
            defaultUiConfig={uiConfig}
            appInsightsKey={appInsightsKey}
            onIModelConnected={onIModelConnected}
            frontstages={frontstages}
            backstageItems={backstageItems}
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
