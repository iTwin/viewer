/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// TODO 3.0 re-add
// import { MeasureTools } from "@bentley/measure-tools-react";
// import { PropertyGridManager } from "@bentley/property-grid-react";
// import { TreeWidget } from "@bentley/tree-widget-react";
import { IModelHubFrontend } from "@bentley/imodelhub-client";
import {
  AppNotificationManager,
  ConfigurableUiManager,
  FrameworkReducer,
  FrameworkUiAdmin,
  StateManager,
  UiFramework,
} from "@itwin/appui-react";
import type { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import { UiComponents } from "@itwin/components-react";
import type { RpcInterface, RpcInterfaceDefinition } from "@itwin/core-common";
import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
} from "@itwin/core-common";
import type { IModelAppOptions } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { ITwinLocalization } from "@itwin/core-i18n";
import { UiCore } from "@itwin/core-react";
import type { ElectronRendererAuthorization } from "@itwin/electron-authorization/lib/cjs/ElectronRenderer";
import { PresentationRpcInterface } from "@itwin/presentation-common";
import { Presentation } from "@itwin/presentation-frontend";

import type { ItwinViewerInitializerParams } from "../types";
import { makeCancellable } from "../utilities/MakeCancellable";
import type { ViewerAuthorizationClient } from "./auth/ViewerAuthorizationClient";
import { ai, trackEvent } from "./telemetry/TelemetryService";

type AuthClient =
  | BrowserAuthorizationClient
  | ViewerAuthorizationClient
  | ElectronRendererAuthorization
  | undefined;

// initialize required iTwin.js services
export class BaseInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _cancel: (() => void) | undefined;
  private static _authClient: AuthClient;

  /**
   * Return the stored auth client
   */
  public static get authClient(): AuthClient {
    return this._authClient;
  }

  /**
   * Set the stored auth client
   */
  public static set authClient(client: AuthClient) {
    this._authClient = client;
  }

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
    viewerOptions?: ItwinViewerInitializerParams
  ): Promise<void> {
    if (!IModelApp.initialized) {
      throw new Error(
        "IModelApp must be initialized prior to rendering the Base Viewer"
      );
    }
    if (UiCore.initialized && !this._initializing) {
      if (viewerOptions?.onIModelAppInit) {
        viewerOptions.onIModelAppInit();
      }
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

      // Add the app's telemetry client if a key was provided
      if (viewerOptions?.appInsightsKey) {
        ai.initialize(viewerOptions?.appInsightsKey);
        IModelApp.telemetry.addClient(ai);
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

      if (viewerOptions?.appInsightsKey) {
        trackEvent("iTwinViewer.Viewer.Initialized");
      }

      // TODO 3.0 re-add
      // if (viewerOptions?.extensions) {
      //   for (const extension of viewerOptions.extensions) {
      //     yield IModelApp.extensionAdmin.addBuildExtension(extension.manifest, extension.loader);
      //   }
      // }
      // yield IModelApp.extensionAdmin.onStartup();

      // TODO 3.0 re-add
      // yield PropertyGridManager.initialize(IModelApp.i18n);
      // yield TreeWidget.initialize(IModelApp.i18n);
      // yield MeasureTools.startup();

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
  options?: ItwinViewerInitializerParams
): IModelAppOptions => {
  // if ITWIN_VIEWER_HOME is defined, the viewer is likely being served from another origin
  const viewerHome = (window as any).ITWIN_VIEWER_HOME;
  if (viewerHome) {
    console.log(`resources served from: ${viewerHome}`);
  }

  return {
    applicationId: options?.productId ?? "3098",
    notifications: new AppNotificationManager(),
    uiAdmin: new FrameworkUiAdmin(),
    rpcInterfaces: getSupportedRpcs(options?.additionalRpcInterfaces ?? []),
    toolAdmin: options?.toolAdmin,
    hubAccess: options?.hubAccess ?? new IModelHubFrontend(), // TODO 3.0
    localization: new ITwinLocalization({
      urlTemplate:
        options?.i18nUrlTemplate ??
        (viewerHome && `${viewerHome}/locales/{{lng}}/{{ns}}.json`),
    }),
    publicPath: `${viewerHome}/` ?? "",
  };
};
