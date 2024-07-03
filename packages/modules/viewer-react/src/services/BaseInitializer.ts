/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { UiSyncEventArgs } from "@itwin/appui-abstract";
import {
  AppNotificationManager,
  FrameworkAccuDraw,
  FrameworkReducer,
  FrameworkUiAdmin,
  SessionStateActionId,
  StateManager,
  SyncUiEventDispatcher,
  UiFramework,
} from "@itwin/appui-react";
import { UiComponents } from "@itwin/components-react";
import type { IModelAppOptions } from "@itwin/core-frontend";
import { AccuSnap, SnapMode } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { ITwinLocalization } from "@itwin/core-i18n";
import { UiCore } from "@itwin/core-react";
import { FrontendIModelsAccess } from "@itwin/imodels-access-frontend";
import { IModelsClient } from "@itwin/imodels-client-management";
import { getInstancesCount } from "@itwin/presentation-common";
import type {
  ISelectionProvider,
  SelectionChangeEventArgs,
} from "@itwin/presentation-frontend";
import { Presentation } from "@itwin/presentation-frontend";
import { RealityDataAccessClient } from "@itwin/reality-data-client";

import { ViewerPerformance } from "../services/telemetry";
import type { ViewerInitializerParams } from "../types";
import { makeCancellable } from "../utilities/MakeCancellable";
import { ChangesetIndexAndId } from "@itwin/core-common";

const syncSelectionCount = () => {
  Presentation.selection.selectionChange.addListener(
    (args: SelectionChangeEventArgs, provider: ISelectionProvider) => {
      if (args.level !== 0) {
        // don't need to handle sub-selections
        return;
      }
      const selection = provider.getSelection(args.imodel, args.level);
      const numSelected = getInstancesCount(selection);

      UiFramework.dispatchActionToStore(
        SessionStateActionId.SetNumItemsSelected,
        numSelected
      );

      // NOTE: add a one time event listener to the iModelConnection.selectionSet.onChanged to restore the numSelected to the value that we
      // extracted from the Presentation.selection.selectionChange event in order to override the numSelected AppUi sets from
      // the iModelConnection.selectionSet.onChanged that will treat assemblies as a collection of elements instead of a single one
      UiFramework.getIModelConnection()?.selectionSet.onChanged.addOnce(
        (_ev) => {
          UiFramework.dispatchActionToStore(
            SessionStateActionId.SetNumItemsSelected,
            numSelected
          );
        }
      );
    }
  );
};

// This preserves how the active selection scope was synced between Presentation and AppUi before its removal in 4.x
const syncActiveSelectionScope = () => {
  // If the user doesn't set any active scope and uses the default scope, then the Presentation active scope would be undefined.
  // Thus, we have to sync it for the first time here.
  Presentation.selection.scopes.activeScope =
    UiFramework.getActiveSelectionScope();

  SyncUiEventDispatcher.onSyncUiEvent.addListener((args: UiSyncEventArgs) => {
    if (args.eventIds.has(SessionStateActionId.SetSelectionScope)) {
      // After 4.x the AppUI no longer has a presentation dep and therefore we have the responsibility of
      // syncing the Presentation.selection.scopes.activeScope with the AppUi's UiSyncEvent for SetSelectionScope
      Presentation.selection.scopes.activeScope =
        UiFramework.getActiveSelectionScope();
    }
  });
};

// initialize required iTwin.js services
export class BaseInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _cancel: (() => void) | undefined;

  /** expose initialized promise */
  public static get initialized(): Promise<void> {
    return this._initialized;
  }

  /** expose initialized cancel method */
  public static cancel: () => void = () => {
    BaseInitializer._cancel?.();
    try {
      Presentation.presentation.dispose();
    } catch (err) {
      // Do nothing, its possible that we never started.
    }
    try {
      Presentation.terminate();
    } catch (err) {
      // Do nothing, its possible that we never started.
    }
    try {
      if (UiFramework.initialized) {
        UiFramework.terminate();
      }
    } catch (err) {
      // Do nothing.
    }
    try {
      if (UiComponents.initialized) {
        UiComponents.terminate();
      }
    } catch (err) {
      // Do nothing
    }
    try {
      IModelApp.localization
        .getLanguageList()
        .forEach((ns) => IModelApp.localization.unregisterNamespace(ns));
    } catch (err) {
      // Do nothing
    }
  };

  /** shutdown IModelApp */
  static async shutdown(): Promise<void> {
    await IModelApp.shutdown();
  }

  /** initialize required iTwin.js services */
  public static async initialize(
    viewerOptions?: ViewerInitializerParams
  ): Promise<void> {
    if (!IModelApp.initialized) {
      throw new Error(
        "IModelApp must be initialized prior to rendering the Base Viewer"
      );
    }
    if (UiCore.initialized && !this._initializing) {
      return (this._initialized = Promise.resolve());
    } else if (this._initializing) {
      // in the process of initializing, so return
      return;
    } else {
      // start initializing
      this._initializing = true;
    }

    const cancellable = makeCancellable(function* () {
      // Initialize state manager
      // This will setup a singleton store inside the StoreManager class.
      if (!StateManager.isInitialized()) {
        new StateManager({
          frameworkState: FrameworkReducer,
        });
      }

      // execute the iModelApp initialization callback if provided
      if (viewerOptions?.onIModelAppInit) {
        viewerOptions.onIModelAppInit();
      }

      // initialize localization for the app
      const viewerNamespace = "iTwinViewer";
      let i18nNamespaces = [viewerNamespace];
      if (viewerOptions?.additionalI18nNamespaces) {
        i18nNamespaces = i18nNamespaces.concat(
          viewerOptions.additionalI18nNamespaces
        );
      }
      const i18nPromises = i18nNamespaces.map(async (ns) =>
        IModelApp.localization.registerNamespace(ns)
      );

      yield Promise.all(i18nPromises);

      // initialize UiCore
      yield UiCore.initialize(IModelApp.localization);

      // initialize UiComponents
      yield UiComponents.initialize(IModelApp.localization);

      // initialize UiFramework
      // Use undefined so that UiFramework uses StateManager
      yield UiFramework.initialize(undefined);

      // initialize Presentation
      yield Presentation.initialize(viewerOptions?.presentationProps);

      // Sync selection count & active selection scope between Presentation and AppUi. Runs after the Presentation is initialized.
      syncSelectionCount();
      syncActiveSelectionScope();

      // allow uiAdmin to open key-in palette when Ctrl+F2 is pressed - good for manually loading UI providers
      IModelApp.uiAdmin.updateFeatureFlags({ allowKeyinPalette: true });

      ViewerPerformance.addMark("BaseViewerStarted");
      ViewerPerformance.addMeasure(
        "BaseViewerInitialized",
        "ViewerStarting",
        "BaseViewerStarted"
      );
      console.log("iTwin.js initialized");
    });

    BaseInitializer._cancel = cancellable.cancel;
    this._initialized = cancellable.promise
      .catch((err) => {
        if (err.reason !== "cancelled") {
          throw err;
        }
      })
      .finally(async () => {
        BaseInitializer._initializing = false;
        BaseInitializer._cancel = undefined;
      });
  }
}

/**
 * Generate default iModelApp options
 * @param options
 * @returns
 */
export const getIModelAppOptions = (
  options?: ViewerInitializerParams
): IModelAppOptions => {
  // if ITWIN_VIEWER_HOME is defined, the viewer is likely being served from another origin
  const viewerHome = window.ITWIN_VIEWER_HOME;
  if (viewerHome) {
    console.log(`resources served from: ${viewerHome}`);
  }

  const changeset: ChangesetIndexAndId = {
    id: "a718eb55-ad62-41a0-8dee-54d657442d03",
    index: 0
  }

    const hubAccessClient = options?.isComponent ?     {
      getChangesetFromNamedVersion: async () => changeset,
      getLatestChangeset: async () => changeset,
      getChangesetFromVersion: async () => changeset,
    } :new FrontendIModelsAccess(
      new IModelsClient({
        api: {
          baseUrl: `https://${globalThis.IMJS_URL_PREFIX}api.bentley.com/imodels`,
        },
      })
    );

  const hubAccess =
    options?.hubAccess ?? hubAccessClient;

  const localization =
    options?.localization ??
    new ITwinLocalization({
      urlTemplate:
        options?.i18nUrlTemplate ??
        (viewerHome && `${viewerHome}/locales/{{lng}}/{{ns}}.json`),
    });

  const realityDataAccess =
    options?.realityDataAccess ??
    new RealityDataAccessClient({
      baseUrl: `https://${globalThis.IMJS_URL_PREFIX}api.bentley.com/realitydata`,
    });

  return {
    applicationId: options?.productId ?? "3098",
    accuSnap: new ViewerAccuSnap(),
    accuDraw: new FrameworkAccuDraw(),
    notifications: new AppNotificationManager(),
    uiAdmin: new FrameworkUiAdmin(),
    publicPath: viewerHome ? `${viewerHome}/` : "",
    hubAccess,
    localization,
    mapLayerOptions: options?.mapLayerOptions,
    tileAdmin: options?.tileAdmin,
    toolAdmin: options?.toolAdmin,
    renderSys: options?.renderSys,
    realityDataAccess,
    userPreferences: options?.userPreferences,
  };
};

class ViewerAccuSnap extends AccuSnap {
  public override getActiveSnapModes(): SnapMode[] {
    // The SnapMode in the UiFramework is a bit mask.
    const snapMode = UiFramework.getAccudrawSnapMode();
    const snaps: SnapMode[] = [];
    if (0 < (snapMode & SnapMode.Bisector)) {
      snaps.push(SnapMode.Bisector);
    }
    if (0 < (snapMode & SnapMode.Center)) {
      snaps.push(SnapMode.Center);
    }
    if (0 < (snapMode & SnapMode.Intersection)) {
      snaps.push(SnapMode.Intersection);
    }
    if (0 < (snapMode & SnapMode.MidPoint)) {
      snaps.push(SnapMode.MidPoint);
    }
    if (0 < (snapMode & SnapMode.Nearest)) {
      snaps.push(SnapMode.Nearest);
    }
    if (0 < (snapMode & SnapMode.NearestKeypoint)) {
      snaps.push(SnapMode.NearestKeypoint);
    }
    if (0 < (snapMode & SnapMode.Origin)) {
      snaps.push(SnapMode.Origin);
    }
    return snaps;
  }
}
