/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  SnapshotIModelRpcInterface,
} from "@itwin/core-common";
import type { IModelAppOptions } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { UiCore } from "@itwin/core-react";
import { PresentationRpcInterface } from "@itwin/presentation-common";
import type { ViewerInitializerParams } from "@itwin/viewer-react";

import { DesktopInitializer } from "../../services/Initializer";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient";

describe("Initializer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (UiCore.initialized) {
      UiCore.terminate();
    }
  });

  it("initializes iModelApp", async () => {
    await DesktopInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
    });
    await DesktopInitializer.initialized;
    expect(IModelApp.startup).toHaveBeenCalled();
  });

  it("Should throw an error when IModelApp.startup is called prior to rendering the Viewer", async () => {
    await IModelApp.startup();
    await DesktopInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
    });
    await DesktopInitializer.initialized;
    expect(DesktopInitializer.startWebViewer).toThrowError(
      "Looks like you called IModelApp.startup in your application. Please use the useDesktopViewerInitializer hook instead."
    );
  });
});
