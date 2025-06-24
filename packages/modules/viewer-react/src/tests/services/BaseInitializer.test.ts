/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { StateManager } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";
import { ITwinLocalization } from "@itwin/core-i18n";
import { UiCore } from "@itwin/core-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  BaseInitializer,
  getIModelAppOptions,
} from "../../services/BaseInitializer";
import { MockToolAdmin } from "../mocks/MockToolAdmin";

vi.mock("../../services/iModel/ViewCreator3d", () => {
  return {
    ViewCreator3d: vi.fn().mockImplementation(() => {
      return {
        createDefaultView: vi.fn().mockResolvedValue({}),
      };
    }),
  };
});

vi.mock("@itwin/core-i18n");

vi.mock("@itwin/appui-react", async (importActual) => {
  const original = await importActual<typeof import("@itwin/appui-react")>();

  const StateManagerSpy = vi.fn().mockImplementation(function (...args) {
    return new (original.StateManager as any)(...args);
  });

  Object.setPrototypeOf(StateManagerSpy, original.StateManager);

  return {
    ...original,
    StateManager: StateManagerSpy,
    UiFramework: {
      ...original.UiFramework,
      initialize: vi.fn().mockImplementation(() => Promise.resolve()),
    },
    FrameworkAccuDraw:
      original.FrameworkAccuDraw,
    SyncUiEventDispatcher: {
      ...original.SyncUiEventDispatcher,
      onSyncUiEvent: {
        addListener: vi.fn(),
      },
    },
  };
});

vi.mock("@itwin/presentation-frontend", async (importActual) => {
  const original = await importActual<typeof import("@itwin/presentation-frontend")>();
  return {
    ...original,
    Presentation: {
      ...original.Presentation,
      initialize: vi.fn().mockImplementation(() => Promise.resolve()),
      selection: {
        selectionChange: {
          addListener: vi.fn(),
        },
        scopes: {},
      },
    },
  };
});

vi.mock("@itwin/core-frontend", () => {
  return {
    IModelApp: {
      startup: vi.fn().mockResolvedValue(true),
      telemetry: {
        addClient: vi.fn(),
      },
      localization: {
        registerNamespace: vi.fn().mockReturnValue({
          readFinished: vi.fn().mockResolvedValue(true),
        }),
        getLanguageList: vi.fn().mockReturnValue(["en-US"]),
        unregisterNamespace: vi.fn(),
        translateWithNamespace: vi.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: vi.fn(),
      },
      viewManager: {
        onViewOpen: {
          addOnce: vi.fn(),
        },
      },
      shutdown: vi.fn().mockImplementation(() => Promise.resolve()),
    },
    SnapMode: {},
    ActivityMessageDetails: vi.fn(),
    PrimitiveTool: vi.fn(),
    NotificationManager: vi.fn(),
    Tool: vi.fn(),
    SnapshotConnection: {
      openFile: vi.fn(),
    },
    ToolAdmin: class {},
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class {},
    AccuSnap: class {},
    SpatialViewState: {
      className: "",
    },
    DrawingViewState: {
      className: "",
    },
    SheetViewState: {
      className: "",
    },
  };
});

describe("BaseInitializer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    /* eslint-disable @typescript-eslint/no-deprecated */
    if (UiCore.initialized) {
      UiCore.terminate();
    }
    /* eslint-disable @typescript-eslint/no-deprecated */
    // reset the getter function to true so that it can be overridden to false if needed
    Object.defineProperty(IModelApp, "initialized", {
      get: () => {
        return true;
      },
      configurable: true,
    });
    globalThis.IMJS_URL_PREFIX = "";
  });

  it("gets default iModelApp options", () => {
    const appOptions = getIModelAppOptions();
    expect(appOptions).toEqual({
      applicationId: "3098",
      accuSnap: expect.anything(),
      accuDraw: expect.anything(),
      notifications: expect.anything(),
      uiAdmin: expect.anything(),
      localization: expect.anything(),
      toolAdmin: undefined,
      hubAccess: expect.anything(),
      mapLayerOptions: undefined,
      publicPath: "",
      realityDataAccess: expect.anything(),
      renderSys: undefined,
      tileAdmin: undefined,
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
      onIModelAppInit: vi.fn(),
    };
    await BaseInitializer.initialize({
      onIModelAppInit: callbacks.onIModelAppInit,
      enablePerformanceMonitors: false,
    });
    await BaseInitializer.initialized;
    expect(callbacks.onIModelAppInit).toHaveBeenCalled();
  });

  it("uses the TileAdmin options that are provided", () => {
    const cesiumIonKey = "testKey";
    const appOptions = getIModelAppOptions({
      tileAdmin: { cesiumIonKey },
      enablePerformanceMonitors: false,
    });
    expect(appOptions.tileAdmin).toEqual({ cesiumIonKey });
  });

  it("initializes StateManager", async () => {
    vi.spyOn(StateManager, "isInitialized").mockReturnValue(false);
    await BaseInitializer.initialize();
    await BaseInitializer.initialized;
    expect(StateManager).toHaveBeenCalledTimes(1);
  });

  it("should not re-initialize StateManager", async () => {
    vi.spyOn(StateManager, "isInitialized").mockReturnValue(true);
    await BaseInitializer.initialize();
    await BaseInitializer.initialized;
    expect(StateManager).not.toHaveBeenCalled();
  });
});
