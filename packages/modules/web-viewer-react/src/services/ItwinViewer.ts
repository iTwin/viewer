/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UiItemsProvider } from "@itwin/appui-abstract";
import { ColorTheme, FrameworkVersion } from "@itwin/appui-react";
import { CheckpointConnection } from "@itwin/core-frontend";
import {
  ItwinViewerUi,
  ViewerViewportControlOptions,
} from "@itwin/viewer-react-3.0";
import React from "react";
import ReactDOM from "react-dom";

import { ViewerFrontstage } from "..";
import { Viewer } from "../components/Viewer";
import {
  ItwinViewerParams,
  WebAuthorizationOptions,
  WebViewerProps,
} from "../types";
import { WebInitializer } from "./Initializer";

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
  viewportOptions: ViewerViewportControlOptions | undefined;
  uiProviders: UiItemsProvider[] | undefined;
  authConfig: WebAuthorizationOptions;

  onIModelConnected: ((iModel: CheckpointConnection) => void) | undefined;

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
    this.authConfig = options.authConfig;

    void WebInitializer.startWebViewer(options);
  }

  /** load a model in the viewer once iTwinViewerApp is ready */
  load = async (args: LoadParameters): Promise<void> => {
    if (!args?.contextId || !args?.iModelId) {
      throw new Error("Please provide a valid contextId and iModelId");
    }

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
      } as WebViewerProps),
      document.getElementById(this.elementId)
    );
  };
}
