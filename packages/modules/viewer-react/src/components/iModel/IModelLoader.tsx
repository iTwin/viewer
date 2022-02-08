/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import "./IModelLoader.scss";

import type {
  BackstageActionItem,
  BackstageStageLauncher,
} from "@itwin/appui-abstract";
import { BackstageItemUtilities } from "@itwin/appui-abstract";
import { StateManager, UiFramework } from "@itwin/appui-react";
import type {
  BlankConnectionProps,
  IModelConnection,
} from "@itwin/core-frontend";
import { BlankConnection, IModelApp } from "@itwin/core-frontend";
import { useErrorManager } from "@itwin/error-handling-react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";

import { useIsMounted, useTheme, useUiProviders } from "../../hooks";
import { openLocalImodel, openRemoteIModel } from "../../services/iModel";
import { userAI, ViewerPerformance } from "../../services/telemetry";
import type {
  BlankConnectionViewState,
  IModelLoaderParams,
  ViewerBackstageItem,
  ViewerFrontstage,
} from "../../types";
import { DefaultFrontstage } from "../app-ui/frontstages/DefaultFrontstage";
import { IModelBusy } from "./IModelBusy";
import { IModelViewer } from "./IModelViewer";
export interface ModelLoaderProps extends IModelLoaderParams {
  iTwinId?: string;
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
    iTwinId,
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
      return imodelConnection;
    };

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

    const getModelConnection = useCallback(async (): Promise<
      IModelConnection | undefined
    > => {
      if (blankConnection) {
        return initBlankConnection(blankConnection, onIModelConnected);
      }

      if (!(iTwinId && iModelId) && !snapshotPath) {
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
      // create a new imodelConnection for the passed project and imodel ids
      // TODO add the ability to open a BriefcaseConnection for Electron apps
      if (snapshotPath) {
        imodelConnection = await openLocalImodel(snapshotPath);
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
          onIModelConnected(imodelConnection);
        }
        setConnection(imodelConnection);
        return imodelConnection;
      }
      return;
    }, [
      iTwinId,
      iModelId,
      changeSetId,
      snapshotPath,
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
    }, [getModelConnection]);

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

      if (connection) {
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
    }, [backstageItems, connection]);

    useEffect(() => {
      let allFrontstages: ViewerFrontstage[] = [];
      if (frontstages) {
        allFrontstages = [...frontstages];
      }

      // initialize the DefaultFrontstage that contains the views that we want
      const defaultFrontstageProvider = new DefaultFrontstage(
        defaultUiConfig,
        viewportOptions,
        viewCreatorOptions,
        blankConnectionViewState
      );

      // add the default frontstage first so that it's default status can be overridden
      allFrontstages.unshift({
        provider: defaultFrontstageProvider,
        default: true,
      });

      setFinalFrontstages(allFrontstages);
    }, [
      frontstages,
      viewportOptions,
      defaultUiConfig,
      viewCreatorOptions,
      blankConnectionViewState,
    ]);

    if (error) {
      throw error;
    } else {
      return (
        <div className="itwin-viewer-container">
          {finalFrontstages &&
          finalBackstageItems &&
          (connection || noConnection) &&
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
  userAI.reactPlugin,
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
