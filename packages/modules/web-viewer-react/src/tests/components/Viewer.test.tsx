/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { IModelAppOptions } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import type { ViewerInitializerParams } from "@itwin/viewer-react";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Viewer } from "../../components/Viewer.js";
import { WebInitializer } from "../../services/Initializer.js";
import type { BackendConfiguration } from "../../types.js";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient.js";

vi.mock("@itwin/viewer-react", async () => {
  const originalViewerReact = await vi.importActual<typeof import("@itwin/viewer-react")>("@itwin/viewer-react");
  const originalRpcInit = await vi.importActual<typeof import("../../services/RpcInitializer.js")>("../../services/RpcInitializer");

  return {
    BaseViewer: vi.fn(() => <div data-testid="mock-div"></div>),
    getIModelAppOptions: (
      options: ViewerInitializerParams
    ): IModelAppOptions => {
      return {
        applicationId: options?.productId ?? "3098",
        notifications: expect.anything(),
        uiAdmin: expect.anything(),
        localization: expect.anything(),
        toolAdmin: options?.toolAdmin,
        authorizationClient: expect.anything(),
      };
    },
    useIsMounted: vi.fn().mockReturnValue(true),
    makeCancellable: originalViewerReact.makeCancellable,
    RpcInitializer: originalRpcInit.RpcInitializer,
    useBaseViewerInitializer: vi.fn().mockReturnValue(true),
    getInitializationOptions: vi.fn().mockReturnValue({}),
    isEqual: vi.fn().mockReturnValue(true),
    BaseInitializer: {
      initialize: vi.fn(),
    },
    ViewerPerformance: {
      addMark: vi.fn(),
      addAndLogMeasure: vi.fn(),
      enable: vi.fn(),
    },
    ViewerAuthorization: {
      client: {},
    },
  };
});

vi.mock("@itwin/core-frontend", () => {
  return {
    IModelApp: {
      startup: vi.fn(),
      telemetry: {
        addClient: vi.fn(),
      },
      i18n: {
        registerNamespace: vi.fn().mockReturnValue({
          readFinished: vi.fn().mockResolvedValue(true),
        }),
        languageList: vi.fn().mockReturnValue(["en-US"]),
        translateWithNamespace: vi.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: vi.fn(),
      },
      tools: {
        registerModule: vi.fn(),
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
    RemoteBriefcaseConnection: {
      open: vi.fn(),
    },
    SnapshotConnection: {
      openFile: vi.fn(),
    },
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class { },
    AccuSnap: class { },
    ToolAdmin: class { },
    WebViewerApp: {
      startup: vi.fn().mockResolvedValue(true),
      shutdown: vi.fn().mockResolvedValue(true),
    },
    ViewCreator3d: vi.fn().mockImplementation(() => {
      return {
        createDefaultView: vi.fn().mockResolvedValue({}),
      };
    })
  }
});

const mockITwinId = "123";
const mockIModelId = "456";

const authClient = new MockAuthorizationClient();

describe("Viewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts the WebViewerApp", async () => {
    const { getByTestId } = render(
      <Viewer
        authClient={authClient}
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        enablePerformanceMonitors={false}
      />
    );

    await waitFor(() => getByTestId("mock-div"));

    expect(IModelApp.startup).toHaveBeenCalledWith({
      applicationId: "3098",
      authorizationClient: expect.anything(),
      localization: expect.anything(),
      notifications: expect.anything(),
      uiAdmin: expect.anything(),
      toolAdmin: undefined,
    });
  });

  it("initializes the Viewer with the provided backend configuration", async () => {
    vi.spyOn(WebInitializer, "startWebViewer");

    const backendConfig: BackendConfiguration = {
      defaultBackend: {
        config: {
          info: {
            title: "default Title",
            version: "23.0",
          },
          uriPrefix: "https://customBackendUrl",
        },
      },
    };

    const { getByTestId } = render(
      <Viewer
        authClient={authClient}
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        backendConfiguration={backendConfig}
        enablePerformanceMonitors={false}
      />
    );

    await waitFor(() => getByTestId("mock-div"));

    expect(WebInitializer.startWebViewer).toHaveBeenCalledWith({
      authClient: authClient,
      backendConfiguration: backendConfig,
      iTwinId: mockITwinId,
      iModelId: mockIModelId,
      enablePerformanceMonitors: false,
    });
  });
});
