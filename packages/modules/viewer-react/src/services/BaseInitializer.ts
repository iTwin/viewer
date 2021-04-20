/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ClientRequestContext } from "@bentley/bentleyjs-core";
import { Config } from "@bentley/bentleyjs-core";
import { FrontendApplicationInsightsClient } from "@bentley/frontend-application-insights-client";
import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  RpcInterface,
  RpcInterfaceDefinition,
  SnapshotIModelRpcInterface,
} from "@bentley/imodeljs-common";
import { IModelApp, IModelAppOptions } from "@bentley/imodeljs-frontend";
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

import { IModelBackendOptions, ItwinViewerInitializerParams } from "../types";
import { ai, trackEvent } from "./telemetry/TelemetryService";

// initialize required iModel.js services
export class BaseInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _iModelDataErrorMessage: string | undefined;
  private static _synchronizerRootUrl: string | undefined;

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

  /** add required values to Config.App */
  static setupEnv(options?: IModelBackendOptions): void {
    Config.App.merge({
      imjs_buddi_url:
        options?.buddiServer !== undefined
          ? options.buddiServer
          : "https://buddi.bentley.com/WebService",
      imjs_buddi_resolve_url_using_region:
        options?.buddiRegion !== undefined ? options.buddiRegion : 0,
    });
  }

  /** initialize required iModel.js services */
  public static async initialize(
    viewerOptions?: ItwinViewerInitializerParams
  ): Promise<void> {
    if (this._initializing) {
      // in the process of initializing, so return
      return;
    } else {
      // start initializing
      this._initializing = true;
    }

    this._initialized = new Promise(async (resolve, reject) => {
      try {
        if (UiCore.initialized) {
          // intializations have begun. do not attempt again
          resolve();
          return;
        }
        // Initialize state manager for extensions to have access to extending the redux store
        // This will setup a singleton store inside the StoreManager class.
        new StateManager({
          frameworkState: FrameworkReducer,
        });

        this.setupEnv(viewerOptions?.backend);

        // execute the iModelApp initialization callback if provided
        if (viewerOptions?.onIModelAppInit) {
          viewerOptions.onIModelAppInit();
        }

        // Add iModelJS ApplicationInsights telemetry client if a key is provided
        if (viewerOptions?.imjsAppInsightsKey) {
          const imjsApplicationInsightsClient = new FrontendApplicationInsightsClient(
            viewerOptions.imjsAppInsightsKey
          );
          IModelApp.telemetry.addClient(imjsApplicationInsightsClient);
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

        await Promise.all(i18nPromises);

        // initialize UiCore
        await UiCore.initialize(IModelApp.i18n);

        // initialize UiComponents
        await UiComponents.initialize(IModelApp.i18n);

        // initialize UiFramework
        // Use undefined so that UiFramework uses StateManager
        await UiFramework.initialize(undefined, IModelApp.i18n);

        // initialize Presentation
        await Presentation.initialize({
          activeLocale: IModelApp.i18n.languageList()[0],
        });

        // allow uiAdmin to open key-in palette when Ctrl+F2 is pressed - good for manually loading extensions
        IModelApp.uiAdmin.updateFeatureFlags({ allowKeyinPalette: true });

        ConfigurableUiManager.initialize();

        if (viewerOptions?.appInsightsKey) {
          trackEvent("iTwinViewer.Viewer.Initialized");
        }

        await PropertyGridManager.initialize(IModelApp.i18n);

        await TreeWidget.initialize(IModelApp.i18n);

        // override the defaut daa error message
        this._iModelDataErrorMessage = viewerOptions?.iModelDataErrorMessage;

        console.log("iModel.js initialized");

        this._initializing = false;
        resolve();
      } catch (error) {
        console.error(error);
        reject(error);
      }
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
  };
};
