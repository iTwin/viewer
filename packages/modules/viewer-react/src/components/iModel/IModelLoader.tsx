/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import "./IModelLoader.scss";

import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";
import { StateManager, UiFramework } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { useFrontstages, useTheme, useUiProviders } from "../../hooks";
import { useUnifiedSelectionScopes } from "../../hooks/useUnifiedSelectionScopes";
import { useUnifiedSelectionSync } from "../../hooks/useUnifiedSelectionSync";
import {
  gatherRequiredViewerProps,
  getAndSetViewState,
  openConnection,
} from "../../services/iModel";
import { ViewerPerformance } from "../../services/telemetry";
import { isUnifiedSelectionProps, ModelLoaderProps } from "../../types";
import {
  BackstageItemsProvider,
  SelectionScopesContextProvider,
  SelectionStorageContextProvider,
} from "../app-ui/providers";
import { IModelViewer } from "./IModelViewer";

import type { UiItemsProvider } from "@itwin/appui-react";
import type { IModelConnection } from "@itwin/core-frontend";

const IModelLoader = React.memo((viewerProps: ModelLoaderProps) => {
  const {
    frontstages,
    defaultUiConfig,
    viewportOptions,
    viewCreatorOptions,
    blankConnectionViewState,
    uiProviders,
    theme,
    backstageItems, // eslint-disable-line deprecation/deprecation
    loadingComponent,
  } = viewerProps;
  const { error, connection } = useConnection(viewerProps);

  const providers = useMemo<UiItemsProvider[]>(() => {
    const providers = [...(uiProviders || [])];
    if (backstageItems?.length) {
      providers.push(new BackstageItemsProvider(backstageItems));
    }
    return providers;
  }, [uiProviders, backstageItems]);

  useUiProviders(providers);

  const selectionScopes = useUnifiedSelectionScopes({
    iModelConnection: connection,
    selectionScopes: isUnifiedSelectionProps(viewerProps)
      ? viewerProps.selectionScopes
      : undefined,
  });
  useUnifiedSelectionSync({
    iModelConnection: connection,
    activeSelectionScope: selectionScopes.activeScope.def,
    ...(isUnifiedSelectionProps(viewerProps)
      ? {
          selectionStorage: viewerProps.selectionStorage,
          getSchemaContext: viewerProps.getSchemaContext,
        }
      : {}),
  });

  const { finalFrontstages, noConnectionRequired, customDefaultFrontstage } =
    useFrontstages({
      frontstages,
      defaultUiConfig,
      viewportOptions,
      viewCreatorOptions,
      blankConnectionViewState,
      isUsingDeprecatedSelectionManager: !isUnifiedSelectionProps(viewerProps),
    });

  useTheme(theme);

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
  }

  return (
    <div className="itwin-viewer-container">
      {finalFrontstages &&
      (connection || noConnectionRequired) &&
      StateManager.store ? (
        <Provider store={StateManager.store}>
          <SelectionStorageContextProvider
            selectionStorage={viewerProps.selectionStorage}
          >
            <SelectionScopesContextProvider selectionScopes={selectionScopes}>
              <IModelViewer
                frontstages={finalFrontstages}
                backstageItems={backstageItems}
              />
            </SelectionScopesContextProvider>
          </SelectionStorageContextProvider>
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

export default IModelLoader;
