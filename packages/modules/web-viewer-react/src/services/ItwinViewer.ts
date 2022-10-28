/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ConnectedViewerProps } from "@itwin/viewer-react";
import { ViewerPerformance } from "@itwin/viewer-react";
import React from "react";
import ReactDOM from "react-dom";

import { Viewer } from "../components/Viewer";
import type { ItwinViewerParams, WebInitializerParams } from "../types";
import { WebInitializer } from "./Initializer";

export class ItwinViewer {
  elementId: string;
  options: WebInitializerParams;

  constructor({ elementId, ...options }: ItwinViewerParams) {
    if (!elementId) {
      //TODO localize
      throw new Error("Please supply a root elementId as the first parameter");
    }
    ViewerPerformance.enable(options.enablePerformanceMonitors);
    ViewerPerformance.addMark("ViewerStarting");
    this.elementId = elementId;
    this.options = options;
    void WebInitializer.startWebViewer(options);
  }

  /** load a model in the viewer once iTwinViewerApp is ready */
  load = async (args: ConnectedViewerProps): Promise<void> => {
    if (!args.iTwinId || !args.iModelId) {
      throw new Error("Please provide a valid iTwinId and iModelId");
    }

    const viewerProps = {
      ...args,
      ...this.options,
    } as ConnectedViewerProps & WebInitializerParams;

    // render the viewer for the given iModel on the given element
    ReactDOM.render(
      React.createElement(Viewer, viewerProps),
      document.getElementById(this.elementId)
    );
  };
}
