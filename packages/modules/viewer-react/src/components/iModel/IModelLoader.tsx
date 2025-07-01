/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";

import { StateManager, UiFramework } from "@itwin/appui-react";
import { IModelConnection } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { SvgIModelLoader } from "@itwin/itwinui-illustrations-react";
import { Flex } from "@itwin/itwinui-react";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { useFrontstages, useUiProviders } from "../../hooks/index.js";
import { useUnifiedSelectionScopes } from "../../hooks/useUnifiedSelectionScopes.js";
import { useUnifiedSelectionSync } from "../../hooks/useUnifiedSelectionSync.js";
import {
  gatherRequiredViewerProps,
  getAndSetViewState,
  openConnection,
} from "../../services/iModel/index.js";
import { ViewerPerformance } from "../../services/telemetry/index.js";
import type { ModelLoaderProps } from "../../types.js";
import {
  SelectionScopesContextProvider,
  SelectionStorageContextProvider,
} from "../app-ui/providers/index.js";
import { IModelViewer } from "./IModelViewer.js";
import { createStorage } from "@itwin/unified-selection";
import { createIModelKey } from "@itwin/presentation-core-interop";

export const unifiedSelectionStorage = createStorage();
IModelConnection.onClose.addListener((iModel) => {
  unifiedSelectionStorage.clearStorage({ imodelKey: createIModelKey(iModel) });
});

const IModelLoader = React.memo((viewerProps: ModelLoaderProps) => {
  const {
    frontstages,
    defaultUiConfig,
    viewportOptions,
    viewCreatorOptions,
    blankConnectionViewState,
    uiProviders,
    loadingComponent,
  } = viewerProps;
  const { error, connection } = useConnection(viewerProps);

  useUiProviders(uiProviders);

  const selectionScopes = useUnifiedSelectionScopes({
    iModelConnection: connection,
    selectionScopes: viewerProps.selectionScopes,
  });
  useUnifiedSelectionSync({
    iModelConnection: connection,
    activeSelectionScope: selectionScopes.activeScope.def,
    selectionStorage: unifiedSelectionStorage,
  });

  const { finalFrontstages, noConnectionRequired, customDefaultFrontstage } =
    useFrontstages({
      frontstages,
      defaultUiConfig,
      viewportOptions,
      viewCreatorOptions,
      blankConnectionViewState,
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
      <div style={{ height: "100%" }}>
        {finalFrontstages &&
        (connection || noConnectionRequired) &&
        StateManager.store ? ( // eslint-disable-line @typescript-eslint/no-deprecated
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          <Provider store={StateManager.store}>
            <SelectionStorageContextProvider
              selectionStorage={unifiedSelectionStorage}
            >
              <SelectionScopesContextProvider selectionScopes={selectionScopes}>
                <IModelViewer frontstages={finalFrontstages} />
              </SelectionScopesContextProvider>
            </SelectionStorageContextProvider>
          </Provider>
        ) : (
          <Flex justifyContent="center" style={{ height: "100%" }}>
            {loadingComponent ?? (
              <SvgIModelLoader
                data-testid="loader-wrapper"
                style={{ width: "64px", height: "64px" }}
              />
            )}
          </Flex>
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
