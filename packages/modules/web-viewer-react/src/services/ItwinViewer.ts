/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { UiItemsProvider } from "@itwin/appui-abstract";
import type { ColorTheme } from "@itwin/appui-react";
import type { CheckpointConnection } from "@itwin/core-frontend";
import type {
  ItwinViewerUi,
  ViewerAuthorizationClient,
  ViewerFrontstage,
  ViewerViewportControlOptions,
} from "@itwin/viewer-react";
import { ViewerPerformance } from "@itwin/viewer-react";
import React from "react";
import ReactDOM from "react-dom";

import { Viewer } from "../components/Viewer";
import type { ItwinViewerParams, WebViewerProps } from "../types";
import { WebInitializer } from "./Initializer";

export interface LoadParameters {
  iTwinId?: string;
  iModelId?: string;
  changeSetId?: string;
}

export class ItwinViewer {
  elementId: string;
  theme: ColorTheme | string | undefined;
  uiConfig: ItwinViewerUi | undefined;
  appInsightsKey: string | undefined;
  frontstages: ViewerFrontstage[] | undefined;
  viewportOptions: ViewerViewportControlOptions | undefined;
  uiProviders: UiItemsProvider[] | undefined;
  authConfig: ViewerAuthorizationClient;
  enablePerformanceMonitors: boolean;

  onIModelConnected: ((iModel: CheckpointConnection) => void) | undefined;

  constructor(options: ItwinViewerParams) {
    if (!options.elementId) {
      //TODO localize
      throw new Error("Please supply a root elementId as the first parameter"); //TODO localize
    }
    ViewerPerformance.enable(options.enablePerformanceMonitors);
    ViewerPerformance.addMark("ViewerStarting");
    this.elementId = options.elementId;
    this.theme = options.theme;
    this.uiConfig = options.defaultUiConfig;
    this.appInsightsKey = options.appInsightsKey;
    this.onIModelConnected = options.onIModelConnected;
    this.frontstages = options.frontstages;
    this.viewportOptions = options.viewportOptions;
    this.uiProviders = options.uiProviders;
    this.authConfig = options.authConfig;
    this.enablePerformanceMonitors = options.enablePerformanceMonitors;

    void WebInitializer.startWebViewer(options);
  }

  /** load a model in the viewer once iTwinViewerApp is ready */
  load = async (args: LoadParameters): Promise<void> => {
    if (!args?.iTwinId || !args?.iModelId) {
      throw new Error("Please provide a valid iTwinId and iModelId");
    }

    // render the viewer for the given iModel on the given element
    ReactDOM.render(
      React.createElement(Viewer, {
        authConfig: this.authConfig,
        iTwinId: args?.iTwinId,
        iModelId: args?.iModelId,
        changeSetId: args?.changeSetId,
        uiConfig: this.uiConfig,
        appInsightsKey: this.appInsightsKey,
        onIModelConnected: this.onIModelConnected,
        frontstages: this.frontstages,
        viewportOptions: this.viewportOptions,
        uiProviders: this.uiProviders,
        theme: this.theme,
        enablePerformanceMonitors: this.enablePerformanceMonitors,
      } as WebViewerProps),
      document.getElementById(this.elementId)
    );
  };
}
