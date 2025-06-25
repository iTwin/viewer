/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { BentleyCloudRpcManager } from "@itwin/core-common";
import type { IModelAppOptions } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { UiCore } from "@itwin/core-react";
import type { ViewerInitializerParams } from "@itwin/viewer-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { WebInitializer } from "../../services/Initializer.js";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient.js";
import {
  defaultRpcInterfaces,
  TestRpcInterface,
  TestRpcInterface2,
} from "../test-helpers/rpc.js";

vi.mock("@itwin/core-frontend", async (importActual) => {
  const noMock = await importActual<typeof import("@itwin/core-frontend")>();
  return {
    IModelApp: {
      startup: vi.fn().mockResolvedValue(true),
      telemetry: {
        addClient: vi.fn(),
      },
      i18n: {
        registerNamespace: vi.fn().mockReturnValue({
          readFinished: vi.fn().mockResolvedValue(true),
        }),
        languageList: vi.fn().mockReturnValue(["en-US"]),
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
    },
    SnapMode: {},
    ActivityMessageDetails: vi.fn(),
    PrimitiveTool: vi.fn(),
    NotificationManager: vi.fn(),
    Tool: vi.fn(),
    SnapshotConnection: {
      openFile: vi.fn(),
    },
    ToolAdmin: noMock.ToolAdmin,
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class { },
    AccuSnap: class { },
    WebViewerApp: {
      startup: vi.fn().mockResolvedValue(true),
      shutdown: vi.fn().mockResolvedValue(true),
    },
    ViewCreator3d: vi.fn().mockImplementation(() => {
      return {
        createDefaultView: vi.fn().mockResolvedValue({}),
      };
    }),
  };
});

vi.mock("@itwin/viewer-react", async (importActual) => {
  const originalViewerReact = await importActual<typeof import("@itwin/viewer-react")>();

  return {
    BaseViewer: vi.fn(),
    getIModelAppOptions: (
      options: ViewerInitializerParams
    ): IModelAppOptions => {
      return {
        applicationId: options?.productId ?? "3098",
        notifications: expect.anything(),
        uiAdmin: expect.anything(),
        rpcInterfaces: [...defaultRpcInterfaces],
        localization: expect.anything(),
        toolAdmin: options?.toolAdmin,
        authorizationClient: expect.anything(),
      };
    },
    useIsMounted: vi.fn().mockReturnValue(true),
    makeCancellable: originalViewerReact.makeCancellable,
    useBaseViewerInitializer: vi.fn().mockReturnValue(true),
    getInitializationOptions: vi.fn().mockReturnValue({}),
    isEqual: vi.fn().mockReturnValue(true),
    BaseInitializer: {
      initialize: vi.fn(),
    },
    ViewerPerformance: {
      addMark: vi.fn(),
      addMeasure: vi.fn(),
      enable: vi.fn(),
    },
    ViewerAuthorization: {
      client: vi.fn(),
    },
  };
});

const initClientSpy = vi.spyOn(BentleyCloudRpcManager, "initializeClient");

describe("Initializer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (UiCore.initialized) { // eslint-disable-line @typescript-eslint/no-deprecated
      UiCore.terminate(); // eslint-disable-line @typescript-eslint/no-deprecated
    }
  });

  it("initializes iModelApp", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
    });
    await WebInitializer.initialized;
    expect(IModelApp.startup).toHaveBeenCalled();
  });

  it("initializes default RPC interfaces", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
    });
    await WebInitializer.initialized;
    expect(initClientSpy).toHaveBeenCalledTimes(1);
    expect(initClientSpy).toHaveBeenCalledWith(
      {
        info: {
          title: "imodel/rpc",
          version: "v5",
        },
        uriPrefix: "https://api.bentley.com",
      },
      defaultRpcInterfaces
    );
  });

  it("initializes default RPC interfaces with altered default backend url", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
      backendConfiguration: {
        defaultBackend: {
          config: {
            uriPrefix: "https://alteredBackendUrl.bentley",
          },
        },
      },
    });

    await WebInitializer.initialized;
    expect(initClientSpy).toHaveBeenCalledTimes(1);
    expect(initClientSpy).toHaveBeenCalledWith(
      {
        info: {
          title: "imodel/rpc",
          version: "v5",
        },
        uriPrefix: "https://alteredBackendUrl.bentley",
      },
      defaultRpcInterfaces
    );
  });

  it("initializes default RPC interfaces with altered title and version", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
      backendConfiguration: {
        defaultBackend: {
          config: {
            info: {
              title: "Custom title",
              version: "Custom version",
            },
          },
        },
      },
    });

    await WebInitializer.initialized;
    expect(initClientSpy).toHaveBeenCalledTimes(1);
    expect(initClientSpy).toHaveBeenCalledWith(
      {
        info: {
          title: "Custom title",
          version: "Custom version",
        },
        uriPrefix: "https://api.bentley.com",
      },
      defaultRpcInterfaces
    );
  });

  it("initializes default RPC interfaces with additional rpcs", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
      backendConfiguration: {
        defaultBackend: {
          rpcInterfaces: [TestRpcInterface],
        },
      },
    });

    await WebInitializer.initialized;
    expect(initClientSpy).toHaveBeenCalledTimes(1);
    expect(initClientSpy).toHaveBeenCalledWith(
      {
        info: {
          title: "imodel/rpc",
          version: "v5",
        },
        uriPrefix: "https://api.bentley.com",
      },
      [...defaultRpcInterfaces, TestRpcInterface]
    );
  });

  it("initializes multiple backends - specified custom (default included by default)", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
      backendConfiguration: {
        customBackends: [
          {
            config: {
              info: { title: "My Custom Backend", version: "1.0" },
              uriPrefix: "https://custombackend.bentley",
            },
            rpcInterfaces: [TestRpcInterface],
          },
        ],
      },
    });

    expect(initClientSpy).toHaveBeenNthCalledWith(
      1,
      {
        info: {
          title: "imodel/rpc",
          version: "v5",
        },
        uriPrefix: "https://api.bentley.com",
      },
      defaultRpcInterfaces
    );

    expect(initClientSpy).toHaveBeenNthCalledWith(
      2,
      {
        info: { title: "My Custom Backend", version: "1.0" },
        uriPrefix: "https://custombackend.bentley",
      },
      [TestRpcInterface]
    );
  });

  it("initializes multiple backends - specified custom and specified default", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
      backendConfiguration: {
        customBackends: [
          {
            config: {
              info: { title: "My Custom Backend", version: "3.0" },
              uriPrefix: "https://custombackend.bentley.specified2",
            },
            rpcInterfaces: [TestRpcInterface],
          },
        ],
        defaultBackend: {
          config: {
            info: {
              title: "specified default backend",
              version: "2.0",
            },
          },
        },
      },
    });

    expect(initClientSpy).toHaveBeenNthCalledWith(
      1,
      {
        info: {
          title: "specified default backend",
          version: "2.0",
        },
        uriPrefix: "https://api.bentley.com",
      },
      defaultRpcInterfaces
    );

    expect(initClientSpy).toHaveBeenNthCalledWith(
      2,
      {
        info: { title: "My Custom Backend", version: "3.0" },
        uriPrefix: "https://custombackend.bentley.specified2",
      },
      [TestRpcInterface]
    );
  });

  it("initializes many backends - multiple custom and specified default", async () => {
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
      backendConfiguration: {
        customBackends: [
          {
            config: {
              info: { title: "My Custom Backend", version: "3.0" },
              uriPrefix: "https://custombackend.bentley.specified2",
            },
            rpcInterfaces: [TestRpcInterface],
          },
          {
            config: {
              info: { title: "My Custom Backend 2", version: "4.0" },
              uriPrefix: "https://custombackend.bentley.specified3",
            },
            rpcInterfaces: [TestRpcInterface2],
          },
        ],
        defaultBackend: {
          config: {
            info: {
              title: "specified default backend",
              version: "2.0",
            },
          },
        },
      },
    });

    expect(initClientSpy).toHaveBeenNthCalledWith(
      1,
      {
        info: {
          title: "specified default backend",
          version: "2.0",
        },
        uriPrefix: "https://api.bentley.com",
      },
      defaultRpcInterfaces
    );

    expect(initClientSpy).toHaveBeenNthCalledWith(
      2,
      {
        info: { title: "My Custom Backend", version: "3.0" },
        uriPrefix: "https://custombackend.bentley.specified2",
      },
      [TestRpcInterface]
    );

    expect(initClientSpy).toHaveBeenNthCalledWith(
      3,
      {
        info: { title: "My Custom Backend 2", version: "4.0" },
        uriPrefix: "https://custombackend.bentley.specified3",
      },
      [TestRpcInterface2]
    );
  });
});
