/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { FillCentered } from "@itwin/core-react";
import React from "react";

import { useAccessToken } from "../hooks/useAccessToken";
import { useBaseViewerInitializer } from "../hooks/useBaseViewerInitializer";
import type {
  BlankViewerProps,
  ConnectedViewerProps,
  FileViewerProps,
  ViewerCommonProps,
} from "../types";
import { ErrorBoundary } from "./error/ErrorBoundary";
import IModelLoader from "./iModel/IModelLoader";

type ViewerProps = (ConnectedViewerProps | FileViewerProps | BlankViewerProps) &
  ViewerCommonProps;

export const BaseViewer = ({
  productId,
  i18nUrlTemplate,
  onIModelAppInit,
  additionalI18nNamespaces,
  additionalRpcInterfaces,
  enablePerformanceMonitors,
  ...loaderProps
}: ViewerProps) => {
  React.useEffect(() => {
    console.count("BaseViewer mounting");
    return () => {
      console.count("BaseViewer unmounting");
    };
  }, []);

  const viewerInitialized = useBaseViewerInitializer({
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
      {("filePath" in loaderProps && loaderProps.filePath) || accessToken ? (
        viewerInitialized ? (
          <IModelLoader {...loaderProps} />
        ) : (
          <FillCentered>Initializing...</FillCentered>
        )
      ) : (
        <FillCentered>Please provide a valid access token.</FillCentered>
      )}
    </ErrorBoundary>
  );
};
