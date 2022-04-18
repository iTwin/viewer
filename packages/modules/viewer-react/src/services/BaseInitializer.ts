/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  AppNotificationManager,
  ConfigurableUiManager,
  FrameworkReducer,
  FrameworkUiAdmin,
  StateManager,
  UiFramework,
} from "@itwin/appui-react";
import { UiComponents } from "@itwin/components-react";
import type { RpcInterface, RpcInterfaceDefinition } from "@itwin/core-common";
import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
} from "@itwin/core-common";
import type {
  BuiltInExtensionLoaderProps,
  IModelAppOptions,
} from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { ITwinLocalization } from "@itwin/core-i18n";
import { UiCore } from "@itwin/core-react";
import { FrontendIModelsAccess } from "@itwin/imodels-access-frontend";
import { IModelsClient } from "@itwin/imodels-client-management";
import { PresentationRpcInterface } from "@itwin/presentation-common";
import { Presentation } from "@itwin/presentation-frontend";
import { RealityDataAccessClient } from "@itwin/reality-data-client";

import { ViewerPerformance } from "../services/telemetry";
import type { ViewerInitializerParams } from "../types";
import { makeCancellable } from "../utilities/MakeCancellable";

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
    if (BaseInitializer._cancel) {
      BaseInitializer._cancel();
    }
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
      new StateManager({
        frameworkState: FrameworkReducer,
      });

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
      yield Presentation.initialize({
        presentation: {
          activeLocale: IModelApp.localization.getLanguageList()[0],
        },
      });

      // allow uiAdmin to open key-in palette when Ctrl+F2 is pressed - good for manually loading UI providers
      IModelApp.uiAdmin.updateFeatureFlags({ allowKeyinPalette: true });

      ConfigurableUiManager.initialize();

      ViewerPerformance.addMark("BaseViewerStarted");
      void ViewerPerformance.addMeasure(
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
 * Get complete list of default + additional rpcInterfaces
 * @param additionalRpcInterfaces
 * @returns
 */
const getSupportedRpcs = (
  additionalRpcInterfaces: RpcInterfaceDefinition<RpcInterface>[]
): RpcInterfaceDefinition<RpcInterface>[] => {
  return [
    IModelReadRpcInterface,
    IModelTileRpcInterface,
    PresentationRpcInterface,
    ...additionalRpcInterfaces,
  ];
};

/**
 * Generate default iModelApp options
 * @param options
 * @returns
 */
export const getIModelAppOptions = (
  options?: ViewerInitializerParams
): IModelAppOptions => {
  // if ITWIN_VIEWER_HOME is defined, the viewer is likely being served from another origin
  const viewerHome = (window as any).ITWIN_VIEWER_HOME;
  if (viewerHome) {
    console.log(`resources served from: ${viewerHome}`);
  }

  const iModelsClient = new IModelsClient({
    api: {
      baseUrl: `https://${
        process.env.IMJS_URL_PREFIX ?? ""
      }api.bentley.com/imodels`,
    },
  });

  const realityDataClient = new RealityDataAccessClient({
    baseUrl: `https://${
      process.env.IMJS_URL_PREFIX ?? ""
    }api.bentley.com/realitydata`,
  });

  return {
    applicationId: options?.productId ?? "3098",
    notifications: new AppNotificationManager(),
    uiAdmin: new FrameworkUiAdmin(),
    rpcInterfaces: getSupportedRpcs(options?.additionalRpcInterfaces ?? []),
    toolAdmin: options?.toolAdmin,
    hubAccess: options?.hubAccess ?? new FrontendIModelsAccess(iModelsClient),
    localization: new ITwinLocalization({
      urlTemplate:
        options?.i18nUrlTemplate ??
        (viewerHome && `${viewerHome}/locales/{{lng}}/{{ns}}.json`),
    }),
    publicPath: viewerHome ? `${viewerHome}/` : "",
    realityDataAccess: realityDataClient,
    mapLayerOptions: options?.mapLayerOptions,
    tileAdmin: options?.tileAdmin,
  };
};

/**
 * Register extensions with the IModelApp ExtensionAdmin instance
 * TODO build time only ATM
 * @param extensions
 * @returns
 */
export const addExtensions = async (
  extensions: BuiltInExtensionLoaderProps[]
) => {
  return Promise.all(
    extensions.map((extension) =>
      IModelApp.extensionAdmin.addBuildExtension(
        extension.manifest,
        extension.loader
      )
    )
  );
};
