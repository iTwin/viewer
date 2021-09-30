/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { Config } from "@bentley/bentleyjs-core";
import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  RpcInterface,
  RpcInterfaceDefinition,
  SnapshotIModelRpcInterface,
} from "@bentley/imodeljs-common";
import {
  FitViewTool,
  IModelApp,
  IModelAppOptions,
  ScreenViewport,
  StandardViewId,
} from "@bentley/imodeljs-frontend";
import { I18N } from "@bentley/imodeljs-i18n";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import { PresentationRpcInterface } from "@bentley/presentation-common";
import { Presentation } from "@bentley/presentation-frontend";
import { PropertyGridManager } from "@bentley/property-grid-react";
import { TreeWidget } from "@bentley/tree-widget-react";
import { UiComponents } from "@bentley/ui-components";
import { UiCore } from "@bentley/ui-core";
import {
  AppNotificationManager,
  ConfigurableUiManager,
  FrameworkReducer,
  FrameworkUiAdmin,
  StateManager,
  UiFramework,
} from "@bentley/ui-framework";

import { ItwinViewerInitializerParams } from "../types";
import { makeCancellable } from "../utilities/MakeCancellable";
import { ai, trackEvent } from "./telemetry/TelemetryService";

// initialize required iTwin.js services
export class BaseInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _iModelDataErrorMessage: string | undefined;
  private static _synchronizerRootUrl: string | undefined;
  private static _cancel: (() => void) | undefined;

  public static async getSynchronizerUrl(
    contextId: string,
    iModelId: string
  ): Promise<string> {
    if (!this._synchronizerRootUrl) {
      const urlDiscoveryClient = new UrlDiscoveryClient();
      this._synchronizerRootUrl = await urlDiscoveryClient.discoverUrl(
        new ClientRequestContext(),
        "itwinbridgeportal",
        Config.App.get("imjs_buddi_resolve_url_using_region")
      );
    }
    const portalUrl = `${this._synchronizerRootUrl}/${contextId}/${iModelId}`;
    return IModelApp.i18n.translateWithNamespace(
      "iTwinViewer",
      "iModels.synchronizerLink",
      {
        bridgePortal: portalUrl,
      }
    );
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
      // Do nothing.
    }
    try {
      if (UiCore.initialized) {
        UiCore.terminate();
      }
    } catch (err) {
      // Do nothing
    }
    try {
      IModelApp.i18n
        .languageList()
        .forEach((ns) => IModelApp.i18n.unregisterNamespace(ns));
    } catch (err) {
      // Do nothing
    }
  };

  /** Message to display when there are iModel data-related errors */
  public static async getIModelDataErrorMessage(
    contextId: string,
    iModelId: string,
    prefix?: string
  ): Promise<string> {
    if (this._iModelDataErrorMessage !== undefined) {
      return prefix
        ? `${prefix} ${this._iModelDataErrorMessage}`
        : this._iModelDataErrorMessage;
    }
    const synchronizerPortalUrl = await this.getSynchronizerUrl(
      contextId,
      iModelId
    );
    return prefix
      ? `${prefix} ${synchronizerPortalUrl}`
      : synchronizerPortalUrl;
  }

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

      // fit view by default
      IModelApp.viewManager.onViewOpen.addOnce((vp: ScreenViewport) => {
        IModelApp.tools.run(FitViewTool.toolId, vp, true);
        vp.view.setStandardRotation(StandardViewId.Iso);
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
      const i18nPromises = i18nNamespaces.map(
        async (ns) => IModelApp.i18n.registerNamespace(ns).readFinished
      );

      yield Promise.all(i18nPromises);

      // initialize UiCore
      yield UiCore.initialize(IModelApp.i18n);

      // initialize UiComponents
      yield UiComponents.initialize(IModelApp.i18n);

      // initialize UiFramework
      // Use undefined so that UiFramework uses StateManager
      yield UiFramework.initialize(undefined, IModelApp.i18n);

      // initialize Presentation
      yield Presentation.initialize({
        activeLocale: IModelApp.i18n.languageList()[0],
      });

      // allow uiAdmin to open key-in palette when Ctrl+F2 is pressed - good for manually loading UI providers
      IModelApp.uiAdmin.updateFeatureFlags({ allowKeyinPalette: true });

      ConfigurableUiManager.initialize();

      if (viewerOptions?.appInsightsKey) {
        trackEvent("iTwinViewer.Viewer.Initialized");
      }

      yield PropertyGridManager.initialize(IModelApp.i18n);

      yield TreeWidget.initialize(IModelApp.i18n);

      // override the default data error message
      BaseInitializer._iModelDataErrorMessage =
        viewerOptions?.iModelDataErrorMessage;

      console.log("iTwin.js initialized");
    });

    BaseInitializer._cancel = cancellable.cancel;
    this._initialized = cancellable.promise
      .catch((err) => {
        if (err.reason !== "cancelled") {
          throw err;
        }
      })
      .finally(() => {
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
    SnapshotIModelRpcInterface,
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
    i18n: new I18N("iModelJs", {
      urlTemplate: options?.i18nUrlTemplate
        ? options.i18nUrlTemplate
        : viewerHome && `${viewerHome}/locales/{{lng}}/{{ns}}.json`,
    }),
    toolAdmin: options?.toolAdmin,
    imodelClient: options?.imodelClient,
  };
};
