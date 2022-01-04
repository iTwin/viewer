/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  DevToolsRpcInterface,
  IModelReadRpcInterface,
  IModelTileRpcInterface,
} from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { ITwinLocalization } from "@itwin/core-i18n";
import { UiCore } from "@itwin/core-react";
import { PresentationRpcInterface } from "@itwin/presentation-common";

import {
  BaseInitializer,
  getIModelAppOptions,
} from "../../services/BaseInitializer";
import { userAI } from "../../services/telemetry/TelemetryService";
import { MockToolAdmin } from "../mocks/MockToolAdmin";

jest.mock("../../services/iModel/ViewCreator3d", () => {
  return {
    ViewCreator3d: jest.fn().mockImplementation(() => {
      return {
        createDefaultView: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

jest.mock("@itwin/core-i18n");
jest.mock("@itwin/appui-react", () => {
  return {
    ...jest.createMockFromModule<any>("@itwin/appui-react"),
    UiFramework: {
      ...jest.createMockFromModule<any>("@itwin/appui-react").UiFramework,
      initialize: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  };
});
jest.mock("@itwin/presentation-frontend", () => {
  return {
    ...jest.createMockFromModule<any>("@itwin/presentation-frontend"),
    Presentation: {
      ...jest.createMockFromModule<any>("@itwin/presentation-frontend")
        .Presentation,
      initialize: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  };
});
jest.mock("@itwin/core-frontend", () => {
  const noMock = jest.requireActual("@itwin/core-frontend");
  return {
    IModelApp: {
      startup: jest.fn().mockResolvedValue(true),
      telemetry: {
        addClient: jest.fn(),
      },
      localization: {
        registerNamespace: jest.fn().mockReturnValue({
          readFinished: jest.fn().mockResolvedValue(true),
        }),
        getLanguageList: jest.fn().mockReturnValue(["en-US"]),
        unregisterNamespace: jest.fn(),
        translateWithNamespace: jest.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
      viewManager: {
        onViewOpen: {
          addOnce: jest.fn(),
        },
      },
      shutdown: jest.fn().mockImplementation(() => Promise.resolve()),
    },
    SnapMode: {},
    ActivityMessageDetails: jest.fn(),
    PrimitiveTool: jest.fn(),
    NotificationManager: jest.fn(),
    Tool: jest.fn(),
    SnapshotConnection: {
      openFile: jest.fn(),
    },
    ToolAdmin: noMock.ToolAdmin,
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class {},
  };
});
// TODO 3.0
// jest.mock("@bentley/property-grid-react", () => {
//   return {
//     ...jest.createMockFromModule<any>("@bentley/property-grid-react"),
//     PropertyGridManager: {
//       ...jest.createMockFromModule<any>("@bentley/property-grid-react")
//         .PropertyGridManager,
//       initialize: jest.fn().mockImplementation(() => Promise.resolve()),
//     },
//   };
// });
jest.mock("../../services/telemetry/TelemetryService");

describe("BaseInitializer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    if (UiCore.initialized) {
      UiCore.terminate();
    }
    // reset the getter function to true so that it can be overridden to false if needed
    Object.defineProperty(IModelApp, "initialized", {
      get: () => {
        return true;
      },
      configurable: true,
    });
  });
  it("gets default iModelApp options", () => {
    const appOptions = getIModelAppOptions();
    expect(appOptions).toEqual({
      applicationId: "3098",
      notifications: expect.anything(),
      uiAdmin: expect.anything(),
      rpcInterfaces: [
        IModelReadRpcInterface,
        IModelTileRpcInterface,
        PresentationRpcInterface,
      ],
      localization: expect.anything(),
      toolAdmin: undefined,
      hubAccess: expect.anything(),
      mapLayerOptions: undefined,
      publicPath: "",
      realityDataAccess: expect.anything(),
    });
  });
  it("sets the applicationId", () => {
    const productId = "1234";
    const appOptions = getIModelAppOptions({
      productId: productId,
      enablePerformanceMonitors: false,
    });
    expect(appOptions.applicationId).toEqual(productId);
  });
  it("registers additional rpcInterfaces", () => {
    const additionalRpcInterfaces = [DevToolsRpcInterface];
    const appOptions = getIModelAppOptions({
      additionalRpcInterfaces: additionalRpcInterfaces,
      enablePerformanceMonitors: false,
    });
    expect(appOptions.rpcInterfaces).toEqual([
      IModelReadRpcInterface,
      IModelTileRpcInterface,
      PresentationRpcInterface,
      DevToolsRpcInterface,
    ]);
  });
  it("registers a toolAdmin", () => {
    const toolAdmin = new MockToolAdmin();
    const appOptions = getIModelAppOptions({
      toolAdmin: toolAdmin,
      enablePerformanceMonitors: false,
    });
    expect(appOptions.toolAdmin).toEqual(toolAdmin);
  });
  it("overrides the i18n url template", () => {
    const i18nUrlTemplate = "host/route";
    getIModelAppOptions({
      i18nUrlTemplate: i18nUrlTemplate,
      enablePerformanceMonitors: false,
    });
    expect(ITwinLocalization).toHaveBeenCalledWith({
      urlTemplate: i18nUrlTemplate,
    });
  });
  it("registers additional i18n namespaces", async () => {
    await BaseInitializer.initialize({
      additionalI18nNamespaces: ["test1", "test2"],
      enablePerformanceMonitors: false,
    });
    await BaseInitializer.initialized;
    expect(IModelApp.localization.registerNamespace).toHaveBeenCalledWith(
      "test1"
    );
    expect(IModelApp.localization.registerNamespace).toHaveBeenCalledWith(
      "test2"
    );
  });
  it("instantiates an instance of the Telemetry Service when an app insights key is provided", async () => {
    const appInsightsKey = "123";
    await BaseInitializer.initialize({
      appInsightsKey: appInsightsKey,
      enablePerformanceMonitors: false,
    });
    await BaseInitializer.initialized;
    expect(userAI.initialize).toHaveBeenCalledWith(appInsightsKey);
  });
  it("does not instantiate an instance of the Telemetry Service when an app insights key is not provided", async () => {
    await BaseInitializer.initialize();
    await BaseInitializer.initialized;
    expect(userAI.initialize).not.toHaveBeenCalled();
  });
  it("fails to initialize if iModelApp has not been initialized", async () => {
    // override the return value of the getter function
    Object.defineProperty(IModelApp, "initialized", {
      get: () => {
        return false;
      },
      configurable: true,
    });
    try {
      await BaseInitializer.initialize();
      console.log("awaited");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toEqual(
        "IModelApp must be initialized prior to rendering the Base Viewer"
      );
    }
  });
  it("executes a callback after IModelApp is initialized", async () => {
    const callbacks = {
      onIModelAppInit: jest.fn(),
    };
    await BaseInitializer.initialize({
      onIModelAppInit: callbacks.onIModelAppInit,
      enablePerformanceMonitors: false,
    });
    await BaseInitializer.initialized;
    expect(callbacks.onIModelAppInit).toHaveBeenCalled();
  });
});
