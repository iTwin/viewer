/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import "./IModelLoader.scss";

import { StateManager, UiFramework } from "@itwin/appui-react";
import type { IModelConnection } from "@itwin/core-frontend";
import { BlankConnection, IModelApp } from "@itwin/core-frontend";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";

import {
  useFrontstages,
  useIsMounted,
  useTheme,
  useUiProviders,
} from "../../hooks";
import {
  getAndSetViewState,
  openLocalIModel,
  openRemoteIModel,
} from "../../services/iModel";
import { ViewerPerformance } from "../../services/telemetry";
import type {
  BlankViewerProps,
  ConnectedViewerProps,
  FileViewerProps,
  LoaderProps,
} from "../../types";
import { IModelViewer } from "./IModelViewer";

type ModelLoaderProps = Partial<
  ConnectedViewerProps & FileViewerProps & BlankViewerProps
> &
  LoaderProps;

const IModelLoader = React.memo(
  ({
    iModelId,
    iTwinId,
    changeSetId,
    onIModelConnected,
    filePath,
    frontstages,
    defaultUiConfig,
    backstageItems,
    viewportOptions,
    blankConnection,
    blankConnectionViewState,
    uiProviders,
    theme,
    viewCreatorOptions,
    loadingComponent,
  }: ModelLoaderProps) => {
    const [error, setError] = useState<Error>();
    const [connection, setConnection] = useState<IModelConnection>();
    const isMounted = useIsMounted();
    const { finalFrontstages, noConnectionRequired, customDefaultFrontstage } =
      useFrontstages({
        frontstages,
        defaultUiConfig,
        viewportOptions,
        viewCreatorOptions,
        blankConnectionViewState,
      });

    useUiProviders(uiProviders);
    useTheme(theme);

    const getModelConnection = useCallback(async (): Promise<
      IModelConnection | undefined
    > => {
      if (!(iTwinId && iModelId) && !filePath && !blankConnection) {
        throw new Error(
          IModelApp.localization.getLocalizedStringWithNamespace(
            "iTwinViewer",
            "missingConnectionProps"
          )
        );
      }

      ViewerPerformance.addMark("IModelConnectionStarted");
      ViewerPerformance.addMeasure(
        "IModelConnecting",
        "ViewerStarting",
        "IModelConnectionStarted"
      );
      let imodelConnection: IModelConnection | undefined;
      // create a new imodelConnection for the passed project and imodel ids or local file
      if (blankConnection) {
        imodelConnection = BlankConnection.create(blankConnection);
      } else if (filePath) {
        imodelConnection = await openLocalIModel(filePath);
      } else if (iTwinId && iModelId) {
        imodelConnection = await openRemoteIModel(
          iTwinId,
          iModelId,
          changeSetId
        );
      }
      ViewerPerformance.addMark("IModelConnection");
      ViewerPerformance.addMeasure(
        "IModelConnected",
        "ViewerStarting",
        "IModelConnection"
      );
      if (imodelConnection && isMounted.current) {
        // Tell the SyncUiEventDispatcher and StateManager about the iModelConnection
        UiFramework.setIModelConnection(imodelConnection, true);

        if (onIModelConnected) {
          await onIModelConnected(imodelConnection);
        }
        setConnection(imodelConnection);
        return imodelConnection;
      }
      return;
    }, [
      iTwinId,
      iModelId,
      changeSetId,
      filePath,
      blankConnection,
      isMounted,
      onIModelConnected,
    ]);

    useEffect(() => {
      let prevConnection: IModelConnection | undefined;

      void getModelConnection()
        .then((connection) => (prevConnection = connection))
        .catch(setError);

      const mounted = isMounted.current;
      return () => {
        if (prevConnection) {
          void prevConnection.close();
          prevConnection = undefined;
        }
        if (mounted) {
          setConnection(undefined);
        }
      };
    }, [getModelConnection, isMounted]);

    useEffect(() => {
      if (customDefaultFrontstage && connection) {
        // there is a custom default frontstage so we need to generate a viewstate for backwards compatibility
        // TODO next revisit/remove in the next major release
        void getAndSetViewState(
          connection,
          viewportOptions,
          viewCreatorOptions,
          blankConnectionViewState
        );
      }
    }, [
      customDefaultFrontstage,
      connection,
      viewportOptions,
      viewCreatorOptions,
      blankConnectionViewState,
    ]);

    if (error) {
      throw error;
    } else {
      return (
        <div className="itwin-viewer-container">
          {finalFrontstages &&
          (connection || noConnectionRequired) &&
          StateManager.store ? (
            <Provider store={StateManager.store}>
              <IModelViewer
                frontstages={finalFrontstages}
                backstageItems={backstageItems}
              />
            </Provider>
          ) : (
            <div className="itwin-viewer-loading-container">
              {loadingComponent ?? (
                <SvgIModelLoader
                  data-testid="loader-wrapper"
                  className="itwin-viewer-loading-icon"
                />
              )}
            </div>
          )}
        </div>
      );
    }
  }
);

export default IModelLoader;
