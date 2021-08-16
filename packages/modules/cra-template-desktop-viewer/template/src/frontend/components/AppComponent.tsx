/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@bentley/icons-generic-webfont/dist/bentley-icons-generic-webfont.css";
import "./AppComponent.css";

import { IModelSelect } from "@bentley/imodel-select-react";
import {
  FitViewTool,
  IModelApp,
  ScreenViewport,
  StandardViewId,
} from "@bentley/imodeljs-frontend";
import { FrontstageManager } from "@bentley/ui-framework";
import {
  Viewer,
  ViewerBackstageItem,
  ViewerFrontstage,
} from "@itwin/desktop-viewer-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { ITwinViewerApp } from "../app/ITwinViewerApp";
import {
  RootState,
  SelectedIModel,
  SwitchState,
  useAppDispatch,
} from "../app/store";
import { IModelSelectFrontstage } from "./frontstages/IModelSelectFrontstage";
import { SignInFrontstage } from "./frontstages/SignInFrontstage";
import { SnapshotSelectFrontstage } from "./frontstages/SnapshotSelectFrontstage";

type LocalStoreName = "snapshot" | "imodel" | "project";
const makeLocalStoreName = (name: LocalStoreName) => `DesktopViewer:${name}`;
const fromLocalStorage = (name: LocalStoreName) =>
  window.localStorage.getItem(makeLocalStoreName(name)) ?? undefined; // replace null with undefined
const toLocalStorage = (baseName: LocalStoreName, val?: string) => {
  const name = makeLocalStoreName(baseName);
  const storage = window.localStorage;
  if (!val) {
    storage.removeItem(name);
  } else {
    storage.setItem(name, val);
  }
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AppComponent = () => {
  const [projectId, setProjectId] = useState<string>();
  const [iModelId, setIModelId] = useState<string>();
  const [snapshotPath, setSnapshotPath] = useState<string>();
  const [frontstages, setFrontstages] = useState<ViewerFrontstage[]>();
  const [backstageItems, setBackstageItems] = useState<ViewerBackstageItem[]>();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [connectedMode, setConnectedMode] = useState<boolean>(false);
  const [frontstage, setFrontstage] = useState<
    "IModelSelector" | "SnapshotSelector" | "Viewer"
  >();

  const selectedSnapshot = useSelector<RootState, string>(
    (state: RootState) => state?.selectedSnapshot
  );
  const selectedIModel = useSelector<RootState, SelectedIModel | undefined>(
    (state: RootState) => state?.selectedIModel
  );
  const switchSelectionState = useSelector<RootState, SwitchState>(
    (state: RootState) => state?.switchState
  );

  const dispatch = useAppDispatch();

  const onIModelAppInitialized = async () => {
    await IModelSelect.initialize(IModelApp.i18n);

    const config = await ITwinViewerApp.ipcCall.getConfig();
    if (config?.snapshotName) {
      dispatch({
        type: "OPEN_SNAPSHOT",
        payload: config.snapshotName,
      });
    }
  };

  useEffect(() => {
    if (connectedMode) {
      IModelApp.authorizationClient?.onUserStateChanged.addListener(() => {
        setIsAuthorized(IModelApp.authorizationClient?.isAuthorized || false);
      });
    }
  }, [connectedMode]);

  const openIModelSelector = async () => {
    setConnectedMode(true);
    setFrontstage("IModelSelector");
    let frontstageDef;
    if (isAuthorized) {
      frontstageDef = FrontstageManager.findFrontstageDef("IModelSelector");
    } else {
      frontstageDef = FrontstageManager.findFrontstageDef("SignIn");
    }
    await FrontstageManager.setActiveFrontstageDef(frontstageDef);
  };

  const openSnapshotSelector = async () => {
    setConnectedMode(false);
    setFrontstage("SnapshotSelector");
    const frontstageDef =
      FrontstageManager.findFrontstageDef("SnapshotSelector");
    await FrontstageManager.setActiveFrontstageDef(frontstageDef);
  };

  const initIModel = useCallback(() => {
    if (selectedIModel) {
      setFrontstage("Viewer");
      setSnapshotPath(undefined);
      setProjectId(selectedIModel.projectId);
      setIModelId(selectedIModel.iModelId);
      toLocalStorage("snapshot");
      toLocalStorage("imodel", selectedIModel.iModelId);
      toLocalStorage("project", selectedIModel.projectId);
    }
  }, [selectedIModel]);

  const initSnapshot = useCallback(() => {
    if (selectedSnapshot) {
      setFrontstage("Viewer");
      setSnapshotPath(selectedSnapshot);
      setProjectId(undefined);
      setIModelId(undefined);
      toLocalStorage("snapshot", selectedSnapshot);
      toLocalStorage("imodel");
      toLocalStorage("project");
    }
  }, [selectedSnapshot]);

  useEffect(() => {
    if (switchSelectionState === SwitchState.OpenIModel) {
      initIModel();
    } else if (switchSelectionState === SwitchState.OpenSnapshot) {
      initSnapshot();
    }
  }, [switchSelectionState, initIModel, initSnapshot]);

  useEffect(() => {
    setFrontstages([
      {
        provider: new SnapshotSelectFrontstage(),
        default: frontstage === "SnapshotSelector",
      },
      {
        provider: new IModelSelectFrontstage(),
        default: frontstage === "IModelSelector" && isAuthorized,
      },
      {
        provider: new SignInFrontstage(),
        default: frontstage === "IModelSelector" && !isAuthorized,
      },
    ]);

    setBackstageItems([
      {
        id: "iModelSelector",
        execute: openIModelSelector,
        groupPriority: 200,
        itemPriority: 10,
        labeli18nKey: "iTwinViewer:backstage.selectIModel",
        label: "",
      },
      {
        id: "SnapshotSelector",
        execute: openSnapshotSelector,
        groupPriority: 200,
        itemPriority: 20,
        labeli18nKey: "iTwinViewer:backstage.selectSnapshot",
        label: "",
      },
    ]);
  }, [connectedMode, snapshotPath, projectId, iModelId, isAuthorized]);

  useEffect(() => {
    const snapshot = fromLocalStorage("snapshot");
    if (snapshot) {
      setSnapshotPath(snapshot);
    }
  }, []);

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = (viewPort: ScreenViewport) => {
    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          // after 20 seconds, stop waiting and fit the view
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };

    tileTreesLoaded().finally(() => {
      IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  };

  return (
    <Viewer
      contextId={projectId}
      iModelId={iModelId}
      snapshotPath={snapshotPath}
      onIModelAppInit={onIModelAppInitialized}
      frontstages={frontstages}
      backstageItems={backstageItems}
      viewCreatorOptions={{ viewportConfigurer: viewConfiguration }}
    />
  );
};
