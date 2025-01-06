/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import "./IModelLoader.scss";

import type { UiItemsProvider } from "@itwin/appui-react";
import {
  SessionStateActionId,
  StateManager,
  UiFramework,
} from "@itwin/appui-react";
import type { IModelConnection } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { Presentation } from "@itwin/presentation-frontend";
import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";

import { useFrontstages, useUiProviders } from "../../hooks";
import { useUnifiedSelectionSync } from "../../hooks/useUnifiedSelectionSync";
import {
  gatherRequiredViewerProps,
  getAndSetViewState,
  openConnection,
} from "../../services/iModel";
import { ViewerPerformance } from "../../services/telemetry";
import type { ModelLoaderProps } from "../../types";
import { BackstageItemsProvider } from "../app-ui/providers";
import { IModelViewer } from "./IModelViewer";

const IModelLoader = React.memo((viewerProps: ModelLoaderProps) => {
  const {
    frontstages,
    defaultUiConfig,
    viewportOptions,
    viewCreatorOptions,
    blankConnectionViewState,
    uiProviders,
    theme,
    loadingComponent,
    selectionStorage,
    getSchemaContext,
  } = viewerProps;
  const { error, connection } = useConnection(viewerProps);

  // const providers = useMemo<UiItemsProvider[]>(() => {
  //   const providers = [...(uiProviders || [])];
  //   if (backstageItems?.length) {
  //     providers.push(new BackstageItemsProvider(backstageItems));
  //   }
  //   return providers;
  // }, [uiProviders, backstageItems]);

  useUiProviders(uiProviders);
  useUnifiedSelectionSync({
    iModelConnection: connection,
    selectionStorage,
    getSchemaContext,
  });

  const { finalFrontstages, noConnectionRequired, customDefaultFrontstage } =
    useFrontstages({
      frontstages,
      defaultUiConfig,
      viewportOptions,
      viewCreatorOptions,
      blankConnectionViewState,
      // syncWithUnifiedSelectionStorage: !!selectionStorage,
    });

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
        StateManager.store ? ( //eslint-disable-line deprecation/deprecation
          //eslint-disable-next-line deprecation/deprecation
          <Provider store={StateManager.store}>
            <IModelViewer frontstages={finalFrontstages} theme={theme} />
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
});

function useConnection(viewerProps: ModelLoaderProps) {
  const [error, setError] = useState<Error>();
  const [connection, setConnection] = useState<IModelConnection>();
  const onIModelConnected = viewerProps.onIModelConnected;

  useEffect(() => {
    setConnection(undefined);

    let disposed = false;
    const connectionPromise = getConnection(viewerProps);
    const prepareConnection = async () => {
      try {
        const imodelConnection = await connectionPromise;
        if (disposed) {
          return;
        }

        setConnection(imodelConnection);
        if (imodelConnection) {
          // Tell the SyncUiEventDispatcher and StateManager about the iModelConnection
          UiFramework.setIModelConnection(imodelConnection, true);

          if (onIModelConnected) {
            await onIModelConnected(imodelConnection);
          }

          await syncSelectionScopeList(imodelConnection);
        }
      } catch (error: unknown) {
        if (!disposed) {
          setError(error as Error);
        }
      }
    };

    void prepareConnection();

    return () => {
      disposed = true;
      const closeConnection = async () => {
        const imodelConnection = await connectionPromise;
        if (imodelConnection) {
          await imodelConnection.close();
        }
      };
      void closeConnection();
    };
  }, [
    viewerProps.iTwinId,
    viewerProps.iModelId,
    viewerProps.changeSetId,
    viewerProps.filePath,
    onIModelConnected,
  ]);

  return { connection, error };
}

async function getConnection(
  viewerProps: ModelLoaderProps
): Promise<IModelConnection | undefined> {
  const requiredConnectionProps = gatherRequiredViewerProps(viewerProps);

  if (!requiredConnectionProps) {
    throw new Error(
      IModelApp.localization.getLocalizedString([
        "iTwinViewer",
        "missingConnectionProps",
      ])
    );
  }

  ViewerPerformance.addMark("IModelConnectionStarted");
  ViewerPerformance.addMeasure(
    "IModelConnecting",
    "ViewerStarting",
    "IModelConnectionStarted"
  );

  // create a new imodelConnection for the passed project and imodel ids or local file
  const imodelConnection = await openConnection(requiredConnectionProps);

  ViewerPerformance.addMark("IModelConnection");
  ViewerPerformance.addMeasure(
    "IModelConnected",
    "ViewerStarting",
    "IModelConnection"
  );

  return imodelConnection;
}

async function syncSelectionScopeList(iModelConnection: IModelConnection) {
  if (iModelConnection.isBlankConnection() || !iModelConnection.isOpen) {
    return;
  }

  // Fetch the available selection scopes and add them to the redux store
  try {
    const availableScopes =
      await Presentation.selection.scopes.getSelectionScopes(iModelConnection);
    // eslint-disable-next-line deprecation/deprecation
    UiFramework.dispatchActionToStore(
      // eslint-disable-next-line deprecation/deprecation
      SessionStateActionId.SetAvailableSelectionScopes,
      availableScopes
    );
  } catch {
    console.log("Error syncing selection scope list.");
  }
}

export default IModelLoader;
