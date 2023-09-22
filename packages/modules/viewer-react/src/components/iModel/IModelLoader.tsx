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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Provider } from "react-redux";

import {
  useFrontstages,
  useIsMounted,
  useTheme,
  useUiProviders,
} from "../../hooks";
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
  const [error, setError] = useState<Error>();
  const [connection, setConnection] = useState<IModelConnection>();
  const isMounted = useIsMounted();
  const {
    frontstages,
    defaultUiConfig,
    viewportOptions,
    viewCreatorOptions,
    blankConnectionViewState,
    uiProviders,
    theme,
    onIModelConnected,
    backstageItems, // eslint-disable-line deprecation/deprecation
    loadingComponent,
  } = viewerProps;

  const providers = useMemo<UiItemsProvider[]>(() => {
    const providers = [...(uiProviders || [])];
    if (backstageItems?.length) {
      providers.push(new BackstageItemsProvider(backstageItems));
    }
    return providers;
  }, [uiProviders, backstageItems]);

  useUiProviders(providers);

  const { finalFrontstages, noConnectionRequired, customDefaultFrontstage } =
    useFrontstages({
      frontstages,
      defaultUiConfig,
      viewportOptions,
      viewCreatorOptions,
      blankConnectionViewState,
    });

  useTheme(theme);

  // This preserves how the list of selection scopes was synced between Presentation and AppUi before its removal in 4.x
  const syncSelectionScopeList = async (iModelConnection: IModelConnection) => {
    if (iModelConnection.isBlankConnection() || !iModelConnection.isOpen) {
      return;
    }

    // Fetch the available selection scopes and add them to the redux store
    try {
      const availableScopes =
        await Presentation.selection.scopes.getSelectionScopes(
          iModelConnection
        );
      UiFramework.dispatchActionToStore(
        SessionStateActionId.SetAvailableSelectionScopes,
        availableScopes
      );
    } catch {
      console.log("Error syncing selection scope list.");
    }
  };

  const getModelConnection = useCallback(async (): Promise<
    IModelConnection | undefined
  > => {
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

    if (imodelConnection && isMounted.current) {
      // Tell the SyncUiEventDispatcher and StateManager about the iModelConnection
      UiFramework.setIModelConnection(imodelConnection, true);

      if (onIModelConnected) {
        await onIModelConnected(imodelConnection);
      }
      setConnection(imodelConnection);

      await syncSelectionScopeList(imodelConnection);

      return imodelConnection;
    }
    return;
  }, [
    viewerProps.iTwinId,
    viewerProps.iModelId,
    viewerProps.changeSetId,
    viewerProps.filePath,
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
});

export default IModelLoader;
