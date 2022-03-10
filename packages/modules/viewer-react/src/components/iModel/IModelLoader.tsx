/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import "./IModelLoader.scss";

import { StateManager, UiFramework } from "@itwin/appui-react";
import type { IModelConnection } from "@itwin/core-frontend";
import { BlankConnection, IModelApp } from "@itwin/core-frontend";
import { useErrorManager } from "@itwin/error-handling-react";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
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
  openLocalImodel,
  openRemoteIModel,
} from "../../services/iModel";
import { userAI, ViewerPerformance } from "../../services/telemetry";
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

const Loader = React.memo(
  ({
    iModelId,
    iTwinId,
    changeSetId,
    defaultUiConfig,
    onIModelConnected,
    filePath,
    frontstages,
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
      useFrontstages(
        frontstages,
        defaultUiConfig,
        viewportOptions,
        viewCreatorOptions,
        blankConnectionViewState
      );

    useUiProviders(uiProviders);
    useTheme(theme);

    // trigger error boundary when fatal error is thrown
    const errorManager = useErrorManager({});
    useEffect(() => {
      setError(errorManager.fatalError);
    }, [errorManager.fatalError]);

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
      void ViewerPerformance.addAndLogMeasure(
        "IModelConnecting",
        "ViewerStarting",
        "IModelConnectionStarted"
      );
      let imodelConnection: IModelConnection | undefined;
      // create a new imodelConnection for the passed project and imodel ids or local file
      if (blankConnection) {
        imodelConnection = BlankConnection.create(blankConnection);
      } else if (filePath) {
        imodelConnection = await openLocalImodel(filePath);
      } else if (iTwinId && iModelId) {
        imodelConnection = await openRemoteIModel(
          iTwinId,
          iModelId,
          changeSetId
        );
      }
      ViewerPerformance.addMark("IModelConnection");
      void ViewerPerformance.addAndLogMeasure(
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
        .catch((error) => {
          errorManager.throwFatalError(error);
        });

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

const TrackedLoader = withAITracking(
  userAI.reactPlugin,
  Loader,
  "IModelLoader",
  "tracked-loader"
);

type IModelLoaderProps = ModelLoaderProps & {
  appInsightsKey?: string;
};

const IModelLoader = (props: IModelLoaderProps) => {
  if (props.appInsightsKey) {
    return <TrackedLoader {...props} />;
  } else {
    return <Loader {...props} />;
  }
};

export default IModelLoader;
