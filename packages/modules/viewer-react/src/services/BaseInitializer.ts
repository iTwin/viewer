/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import {
  AppNotificationManager,
  FrameworkAccuDraw,
  FrameworkReducer,
  FrameworkUiAdmin,
  StateManager,
  UiFramework,
} from "@itwin/appui-react";
import { UiComponents } from "@itwin/components-react";
import type { IModelAppOptions } from "@itwin/core-frontend";
import { AccuSnap, IModelApp, SnapMode } from "@itwin/core-frontend";
import { ITwinLocalization } from "@itwin/core-i18n";
import { UiCore } from "@itwin/core-react";
import { FrontendIModelsAccess } from "@itwin/imodels-access-frontend";
import { Presentation } from "@itwin/presentation-frontend";
import { RealityDataAccessClient } from "@itwin/reality-data-client";

import { ViewerPerformance } from "../services/telemetry/index.js";
import type { ViewerInitializerParams } from "../types.js";
import { makeCancellable } from "../utilities/MakeCancellable.js";

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

    // eslint-disable-next-line @typescript-eslint/no-deprecated
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
      /* eslint-disable @typescript-eslint/no-deprecated */
      if (!StateManager.isInitialized()) {
        new StateManager({
          frameworkState: FrameworkReducer,
        });
      }
      /* eslint-disable @typescript-eslint/no-deprecated */

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
      yield UiFramework.initialize();

      // initialize Presentation
      yield Presentation.initialize(viewerOptions?.presentationProps);

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

  const hubAccess =
    options?.hubAccess ??
    new FrontendIModelsAccess({
      api: {
        baseUrl: `https://${globalThis.IMJS_URL_PREFIX}api.bentley.com/imodels`,
      },
    });

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
      baseUrl: `https://${globalThis.IMJS_URL_PREFIX}api.bentley.com/reality-management/reality-data`,
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
