/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  BriefcaseConnection,
  CheckpointConnection,
  Extension,
  ExternalServerExtensionLoader,
  IModelApp,
} from "@bentley/imodeljs-frontend";
import { UiItemsProvider } from "@bentley/ui-abstract";
import {
  ColorTheme,
  FrameworkVersion,
  IModelViewportControlOptions,
} from "@bentley/ui-framework";
import { ErrorBoundary } from "@itwin/error-handling-react";
import React from "react";
import ReactDOM from "react-dom";

import { ViewerFrontstage } from "..";
import IModelLoader, {
  ModelLoaderProps,
} from "../components/iModel/IModelLoader";
import { ItwinViewerParams, ItwinViewerUi, ViewerExtension } from "../types";
import { BaseInitializer } from "./BaseInitializer";
import { trackEvent } from "./telemetry/TelemetryService";

export interface LoadParameters {
  contextId?: string;
  iModelId?: string;
  changeSetId?: string;
  snapshotPath?: string;
}

export class ItwinViewer {
  elementId: string;
  theme: ColorTheme | string | undefined;
  uiConfig: ItwinViewerUi | undefined;
  appInsightsKey: string | undefined;
  frontstages: ViewerFrontstage[] | undefined;
  uiFrameworkVersion: FrameworkVersion | undefined;
  viewportOptions: IModelViewportControlOptions | undefined;
  uiProviders: UiItemsProvider[] | undefined;
  extensions: ViewerExtension[] | undefined;

  onIModelConnected:
    | ((iModel: CheckpointConnection | BriefcaseConnection) => void)
    | undefined;

  constructor(options: ItwinViewerParams) {
    if (!options.elementId) {
      //TODO localize
      throw new Error("Please supply a root elementId as the first parameter"); //TODO localize
    }
    this.elementId = options.elementId;
    this.theme = options.theme;
    this.uiConfig = options.defaultUiConfig;
    this.appInsightsKey = options.appInsightsKey;
    this.onIModelConnected = options.onIModelConnected;
    this.frontstages = options.frontstages;
    this.uiFrameworkVersion = options.uiFrameworkVersion;
    this.viewportOptions = options.viewportOptions;
    this.uiProviders = options.uiProviders;
    this.extensions = options.extensions;

    BaseInitializer.initialize({
      appInsightsKey: options.appInsightsKey,
      backend: options.backend,
      productId: options.productId,
      imjsAppInsightsKey: options.imjsAppInsightsKey,
      i18nUrlTemplate: options.i18nUrlTemplate,
      onIModelAppInit: options.onIModelAppInit,
      additionalI18nNamespaces: options.additionalI18nNamespaces,
      additionalRpcInterfaces: options.additionalRpcInterfaces,
    }).catch((error) => {
      throw error;
    });
  }

  /** load a model in the viewer once iTwinViewerApp is ready */
  load = async (args: LoadParameters): Promise<void> => {
    if (!(args?.contextId && args?.iModelId) && !args?.snapshotPath) {
      throw new Error(
        "Please provide a valid contextId and iModelId or a local snapshotPath"
      );
    }

    if (this.appInsightsKey) {
      trackEvent("iTwinViewer.Viewer.Load");
    }
    // ensure iModel.js initialization completes
    await BaseInitializer.initialized;

    // render the viewer for the given iModel on the given element
    ReactDOM.render(
      React.createElement(
        ErrorBoundary,
        {},
        React.createElement(IModelLoader, {
          contextId: args?.contextId,
          iModelId: args?.iModelId,
          changeSetId: args?.changeSetId,
          uiConfig: this.uiConfig,
          appInsightsKey: this.appInsightsKey,
          onIModelConnected: this.onIModelConnected,
          snapshotPath: args?.snapshotPath,
          frontstages: this.frontstages,
          uiFrameworkVersion: this.uiFrameworkVersion,
          viewportOptions: this.viewportOptions,
          uiProviders: this.uiProviders,
          theme: this.theme,
          extensions: this.extensions,
        } as ModelLoaderProps)
      ),
      document.getElementById(this.elementId)
    );
  };

  /**
   * load an extension into the viewer instance
   */
  addExtension = (
    extensionName: string,
    version?: string,
    url?: string,
    args?: string[]
  ): Promise<Extension | undefined> => {
    if (url) {
      IModelApp.extensionAdmin.addExtensionLoaderFront(
        new ExternalServerExtensionLoader(url)
      );
    }
    return IModelApp.extensionAdmin.loadExtension(extensionName, version, args);
  };
}
