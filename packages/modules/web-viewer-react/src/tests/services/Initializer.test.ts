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

import { WebInitializer } from "../../services/Initializer";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient";

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
        rpcInterfaces: [
          IModelReadRpcInterface,
          IModelTileRpcInterface,
          PresentationRpcInterface,
          SnapshotIModelRpcInterface,
          ...(options?.additionalRpcInterfaces ?? []),
        ],
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

describe("Initializer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (UiCore.initialized) {
      UiCore.terminate();
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

  it("Should throw an error when Imodelapp startup is called before webinitizializer", async () => {
    await IModelApp.startup();
    await WebInitializer.startWebViewer({
      authClient: new MockAuthorizationClient(),
      enablePerformanceMonitors: false,
    });
    await WebInitializer.initialized;
    expect("Use the useWebViewInitializer");
  });
});
