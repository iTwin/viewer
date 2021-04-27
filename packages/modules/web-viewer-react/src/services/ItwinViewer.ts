/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
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
import { ItwinViewerUi, ViewerExtension } from "@itwin/viewer-react";
import React from "react";
import ReactDOM from "react-dom";

import { ViewerFrontstage } from "..";
import { Viewer } from "../components/Viewer";
import {
  WebAuthorizationOptions,
  WebItwinViewerParams,
  WebViewerProps,
} from "../types";

export interface LoadParameters {
  contextId?: string;
  iModelId?: string;
  changeSetId?: string;
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
  authConfig: WebAuthorizationOptions;

  onIModelConnected: ((iModel: CheckpointConnection) => void) | undefined;

  constructor(options: WebItwinViewerParams) {
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
    this.authConfig = options.authConfig;

    // void WebInitializer.startWebViewer(options);
  }

  /** load a model in the viewer once iTwinViewerApp is ready */
  load = async (args: LoadParameters): Promise<void> => {
    if (!args?.contextId || !args?.iModelId) {
      throw new Error("Please provide a valid contextId and iModelId");
    }

    //  await WebInitializer.initialized;

    // render the viewer for the given iModel on the given element
    ReactDOM.render(
      React.createElement(Viewer, {
        authConfig: this.authConfig,
        contextId: args?.contextId,
        iModelId: args?.iModelId,
        changeSetId: args?.changeSetId,
        uiConfig: this.uiConfig,
        appInsightsKey: this.appInsightsKey,
        onIModelConnected: this.onIModelConnected,
        frontstages: this.frontstages,
        uiFrameworkVersion: this.uiFrameworkVersion,
        viewportOptions: this.viewportOptions,
        uiProviders: this.uiProviders,
        theme: this.theme,
        extensions: this.extensions,
      } as WebViewerProps),
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
