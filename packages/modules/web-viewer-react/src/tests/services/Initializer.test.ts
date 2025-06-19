/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { BentleyCloudRpcManager } from "@itwin/core-common";
import type { IModelAppOptions } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { UiCore } from "@itwin/core-react";
import type { ViewerInitializerParams } from "@itwin/viewer-react";

import { WebInitializer } from "../../services/Initializer.js";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient.js";
import {
  defaultRpcInterfaces,
  TestRpcInterface,
  TestRpcInterface2,
} from "../test-helpers/rpc.js";

jest.mock("@itwin/core-frontend", () => {
  const noMock = jest.requireActual("@itwin/core-frontend");
  return {
    IModelApp: {
      startup: jest.fn().mockResolvedValue(true),
      telemetry: {
        addClient: jest.fn(),
      },
      i18n: {
        registerNamespace: jest.fn().mockReturnValue({
          readFinished: jest.fn().mockResolvedValue(true),
        }),
        languageList: jest.fn().mockReturnValue(["en-US"]),
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
    WebViewerApp: {
      startup: jest.fn().mockResolvedValue(true),
      shutdown: jest.fn().mockResolvedValue(true),
    },
    ViewCreator3d: jest.fn().mockImplementation(() => {
      return {
        createDefaultView: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

jest.mock("@itwin/viewer-react", () => {
  return {
    BaseViewer: jest.fn(),
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
    useIsMounted: jest.fn().mockReturnValue(true),
    makeCancellable: jest.requireActual(
      "@itwin/viewer-react/lib/cjs/utilities/MakeCancellable"
    ).makeCancellable,
    useBaseViewerInitializer: jest.fn().mockReturnValue(true),
    getInitializationOptions: jest.fn().mockReturnValue({}),
    isEqual: jest.fn().mockReturnValue(true),
    BaseInitializer: {
      initialize: jest.fn(),
    },
    ViewerPerformance: {
      addMark: jest.fn(),
      addMeasure: jest.fn(),
      enable: jest.fn(),
    },
    ViewerAuthorization: {
      client: jest.fn(),
    },
  };
});

const initClientSpy = jest.spyOn(BentleyCloudRpcManager, "initializeClient");

describe("Initializer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
          version: "v4",
        },
        uriPrefix: "https://undefinedapi.bentley.com",
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
          version: "v4",
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
        uriPrefix: "https://undefinedapi.bentley.com",
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
          version: "v4",
        },
        uriPrefix: "https://undefinedapi.bentley.com",
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
          version: "v4",
        },
        uriPrefix: "https://undefinedapi.bentley.com",
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
        uriPrefix: "https://undefinedapi.bentley.com",
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
        uriPrefix: "https://undefinedapi.bentley.com",
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
