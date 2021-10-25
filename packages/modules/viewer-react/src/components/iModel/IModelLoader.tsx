/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import "./IModelLoader.scss";

import {
  BackstageActionItem,
  BackstageItemUtilities,
  BackstageStageLauncher,
} from "@itwin/appui-abstract";
import {
  StateManager,
  SyncUiEventDispatcher,
  UiFramework,
} from "@itwin/appui-react";
import {
  BlankConnection,
  BlankConnectionProps,
  IModelApp,
  IModelConnection,
  ViewState,
} from "@itwin/core-frontend";
import { useErrorManager } from "@itwin/error-handling-react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";

import { useIsMounted, useTheme, useUiProviders } from "../../hooks";
import { openLocalImodel, openRemoteIModel } from "../../services/iModel";
import { createBlankViewState, ViewCreator3d } from "../../services/iModel";
import { ai } from "../../services/telemetry/TelemetryService";
import {
  BlankConnectionViewState,
  IModelLoaderParams,
  ViewCreator3dOptions,
  ViewerBackstageItem,
  ViewerFrontstage,
} from "../../types";
import { DefaultFrontstage } from "../app-ui/frontstages/DefaultFrontstage";
import { IModelBusy, IModelViewer } from ".";

export interface ModelLoaderProps extends IModelLoaderParams {
  contextId?: string;
  iModelId?: string;
  changeSetId?: string;
  appInsightsKey?: string;
  snapshotPath?: string;
  blankConnection?: BlankConnectionProps;
  blankConnectionViewState?: BlankConnectionViewState;
  loadingComponent?: React.ReactNode;
}

const Loader: React.FC<ModelLoaderProps> = React.memo(
  ({
    iModelId,
    contextId,
    changeSetId,
    defaultUiConfig,
    onIModelConnected,
    snapshotPath,
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
    const [finalFrontstages, setFinalFrontstages] =
      useState<ViewerFrontstage[]>();
    const [finalBackstageItems, setFinalBackstageItems] =
      useState<ViewerBackstageItem[]>();
    const [viewState, setViewState] = useState<ViewState>();
    const [noConnection, setNoConnection] = useState<boolean>(false);
    const [connection, setConnection] = useState<IModelConnection>();
    const isMounted = useIsMounted();

    useUiProviders(uiProviders, defaultUiConfig);
    useTheme(theme);

    // trigger error boundary when fatal error is thrown
    const errorManager = useErrorManager({});
    useEffect(() => {
      setError(errorManager.fatalError);
    }, [errorManager.fatalError]);

    /**
     * Initialize a blank connection and viewState
     * @param blankConnection
     */
    const initBlankConnection = (
      blankConnection: BlankConnectionProps,
      onIModelConnected?: (iModel: IModelConnection) => void
    ) => {
      const imodelConnection = BlankConnection.create(blankConnection);
      UiFramework.setIModelConnection(imodelConnection);

      if (onIModelConnected) {
        onIModelConnected(imodelConnection);
      }
      setConnection(imodelConnection);
    };

    const getViewState = useCallback(async () => {
      if (!connection || (!connection.isBlank && connection.isClosed)) {
        setViewState(undefined);
        return;
      }

      let view: ViewState | undefined;
      if (viewportOptions?.viewState) {
        if (typeof viewportOptions.viewState === "function") {
          view = await viewportOptions.viewState(connection);
        } else {
          view = viewportOptions.viewState;
        }
      }
      if (
        !viewportOptions?.alwaysUseSuppliedViewState &&
        (!view ||
          (view.iModel.iModelId !== connection.iModelId && connection.isOpen))
      ) {
        if (connection.isBlankConnection()) {
          view = createBlankViewState(connection, blankConnectionViewState);
        } else {
          // attempt to construct a default viewState
          const viewCreator = new ViewCreator3d(connection);

          const options: ViewCreator3dOptions = viewCreatorOptions
            ? { ...viewCreatorOptions }
            : { useSeedView: true };

          if (options.useSeedView === undefined) {
            options.useSeedView = true;
          }

          view = await viewCreator.createDefaultView(options);
          UiFramework.setActiveSelectionScope("top-assembly");
        }

        // Should not be undefined
        if (!view) {
          throw new Error("No default view state for the imodel!");
        }
        // Set default view state
        UiFramework.setDefaultViewState(view);
      }

      setViewState(view);
    }, [
      connection,
      viewportOptions,
      blankConnectionViewState,
      viewCreatorOptions,
    ]);

    useEffect(() => {
      if (isMounted.current) {
        void getViewState();
      }
    }, [getViewState, isMounted]);

    useEffect(() => {
      // first check to see if some other frontstage is defined as the default
      // allow fronstages other than the default viewport to continue to render if so
      if (frontstages) {
        const defaultFrontstages = frontstages.filter(
          (frontstage) => frontstage.default
        );
        if (defaultFrontstages.length > 0) {
          // there should only be one, but check if any default frontstage requires an iModel connection
          let requiresConnection = false;
          for (let i = 0; i < defaultFrontstages.length; i++) {
            if (defaultFrontstages[i].requiresIModelConnection) {
              requiresConnection = true;
              break;
            }
          }
          if (!requiresConnection) {
            // allow to continue to render
            setNoConnection(true);
            return;
          }
        }
      }
    }, [frontstages]);

    useEffect(() => {
      let prevConnection: IModelConnection | undefined;
      const getModelConnection = async () => {
        if (blankConnection) {
          return initBlankConnection(blankConnection, onIModelConnected);
        }

        if (!(contextId && iModelId) && !snapshotPath) {
          throw new Error(
            IModelApp.localization.getLocalizedStringWithNamespace(
              "iTwinViewer",
              "missingConnectionProps"
            )
          );
        }

        let imodelConnection: IModelConnection | undefined;
        // create a new imodelConnection for the passed project and imodel ids
        // TODO add the ability to open a BriefcaseConnection for Electron apps
        if (snapshotPath) {
          imodelConnection = await openLocalImodel(snapshotPath);
        } else if (contextId && iModelId) {
          imodelConnection = await openRemoteIModel(
            contextId,
            iModelId,
            changeSetId
          );
        }
        if (imodelConnection && isMounted.current) {
          // Tell the SyncUiEventDispatcher and StateManager about the iModelConnection
          UiFramework.setIModelConnection(imodelConnection, true);

          SyncUiEventDispatcher.initializeConnectionEvents(imodelConnection);

          if (onIModelConnected) {
            onIModelConnected(imodelConnection);
          }

          prevConnection = imodelConnection;
          setConnection(imodelConnection);
        }
      };

      getModelConnection().catch((error) => {
        errorManager.throwFatalError(error);
      });

      return () => {
        if (prevConnection) {
          void prevConnection.close();
          prevConnection = undefined;
        }
        if (isMounted.current) {
          setConnection(undefined);
        }
      };
    }, [
      contextId,
      iModelId,
      changeSetId,
      snapshotPath,
      blankConnection,
      blankConnectionViewState,
      isMounted,
    ]);

    useEffect(() => {
      const allBackstageItems: ViewerBackstageItem[] = [];
      if (backstageItems) {
        backstageItems.forEach((backstageItem) => {
          // check for label i18n key and translate if needed
          if (backstageItem.labeli18nKey) {
            let newItem;
            if ((backstageItem as BackstageStageLauncher).stageId) {
              newItem = BackstageItemUtilities.createStageLauncher(
                (backstageItem as BackstageStageLauncher).stageId,
                backstageItem.groupPriority,
                backstageItem.itemPriority,
                IModelApp.localization.getLocalizedString(
                  backstageItem.labeli18nKey
                ),
                backstageItem.subtitle,
                backstageItem.icon
              );
            } else {
              newItem = BackstageItemUtilities.createActionItem(
                backstageItem.id,
                backstageItem.groupPriority,
                backstageItem.itemPriority,
                (backstageItem as BackstageActionItem).execute,
                IModelApp.localization.getLocalizedString(
                  backstageItem.labeli18nKey
                ),
                backstageItem.subtitle,
                backstageItem.icon
              );
            }
            allBackstageItems.push(newItem);
          } else {
            allBackstageItems.push(backstageItem);
          }
        });
      }

      if (viewState) {
        allBackstageItems.unshift({
          stageId: "DefaultFrontstage",
          id: "DefaultFrontstage",
          groupPriority: 100,
          itemPriority: 10,
          label: IModelApp.localization.getLocalizedString(
            "iTwinViewer:backstage.mainFrontstage"
          ),
        });
      }

      setFinalBackstageItems(allBackstageItems);
    }, [backstageItems, viewState]);

    useEffect(() => {
      let allFrontstages: ViewerFrontstage[] = [];
      if (frontstages) {
        allFrontstages = [...frontstages];
      }

      if (viewState) {
        // initialize the DefaultFrontstage that contains the views that we want
        const defaultFrontstageProvider = new DefaultFrontstage(
          viewState,
          defaultUiConfig,
          viewportOptions
        );

        // add the default frontstage first so that it's default status can be overridden
        allFrontstages.unshift({
          provider: defaultFrontstageProvider,
          default: true,
        });
      }

      setFinalFrontstages(allFrontstages);
    }, [frontstages, viewportOptions, viewState, defaultUiConfig]);

    if (error) {
      throw error;
    } else {
      return (
        <div className="itwin-viewer-container">
          {finalFrontstages &&
          finalBackstageItems &&
          ((viewState && connection) || noConnection) &&
          StateManager.store ? (
            <Provider store={StateManager.store}>
              <IModelViewer
                frontstages={finalFrontstages}
                backstageItems={finalBackstageItems}
              />
            </Provider>
          ) : (
            <div className="itwin-viewer-loading-container">
              {loadingComponent ?? <IModelBusy />}
            </div>
          )}
        </div>
      );
    }
  }
);

const TrackedLoader = withAITracking(
  ai.reactPlugin,
  Loader,
  "IModelLoader",
  "tracked-loader"
);

const IModelLoader: React.FC<ModelLoaderProps> = (props: ModelLoaderProps) => {
  if (props.appInsightsKey) {
    return <TrackedLoader {...props} />;
  } else {
    return <Loader {...props} />;
  }
};

export default IModelLoader;
