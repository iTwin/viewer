/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BrowserAuthorizationClientConfiguration } from "@bentley/frontend-authorization-client";
import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  IModelWriteRpcInterface,
  SnapshotIModelRpcInterface,
} from "@bentley/imodeljs-common";
import { IModelAppOptions, WebViewerApp } from "@bentley/imodeljs-frontend";
import { PresentationRpcInterface } from "@bentley/presentation-common";
import { ItwinViewerInitializerParams } from "@itwin/viewer-react";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import { Viewer } from "../../components/Viewer";
import { WebInitializer } from "../../services/Initializer";
import { IModelBackendOptions } from "../../types";

jest.mock("@itwin/viewer-react", () => {
  return {
    BaseViewer: jest.fn(() => <div data-testid="mock-div"></div>),
    getIModelAppOptions: (
      options: ItwinViewerInitializerParams
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
        i18n: expect.anything(),
        toolAdmin: options?.toolAdmin,
        authorizationClient: expect.anything(),
      };
    },
    useIsMounted: jest.fn().mockReturnValue(true),
    makeCancellable: jest.requireActual(
      "@itwin/viewer-react/lib/utilities/MakeCancellable"
    ).makeCancellable,
    useBaseViewerInitializer: jest.fn().mockReturnValue(true),
    getInitializationOptions: jest.fn().mockReturnValue({}),
    isEqual: jest.fn().mockReturnValue(true),
  };
});

jest.mock("@bentley/imodeljs-frontend", () => {
  return {
    IModelApp: {
      startup: jest.fn(),
      telemetry: {
        addClient: jest.fn(),
      },
      i18n: {
        registerNamespace: jest.fn().mockReturnValue({
          readFinished: jest.fn().mockResolvedValue(true),
        }),
        languageList: jest.fn().mockReturnValue(["en-US"]),
        translateWithNamespace: jest.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
      tools: {
        registerModule: jest.fn(),
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
    RemoteBriefcaseConnection: {
      open: jest.fn(),
    },
    SnapshotConnection: {
      openFile: jest.fn(),
    },
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class {},
    ToolAdmin: class {},
    WebViewerApp: {
      startup: jest.fn().mockResolvedValue(true),
      shutdown: jest.fn().mockResolvedValue(true),
    },
  };
});

const mockProjectId = "123";
const mockIModelId = "456";

const authConfig: BrowserAuthorizationClientConfiguration = {
  clientId: "test-client",
  scope: "test-scope",
  responseType: "code",
  redirectUri: "http://localhost",
};

describe("Viewer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts the WebViewerApp", async () => {
    const { getByTestId } = render(
      <Viewer
        authConfig={{ config: authConfig }}
        contextId={mockProjectId}
        iModelId={mockIModelId}
        additionalRpcInterfaces={[IModelWriteRpcInterface]}
      />
    );

    await waitFor(() => getByTestId("mock-div"));

    expect(WebViewerApp.startup).toHaveBeenCalledWith({
      webViewerApp: {
        rpcParams: {
          info: {
            title: "general-purpose-imodeljs-backend",
            version: "v2.0",
          },
          uriPrefix: "https://api.bentley.com/imodeljs",
        },
        authConfig: authConfig,
        routing: undefined,
      },
      iModelApp: {
        applicationId: "3098",
        authorizationClient: expect.anything(),
        i18n: expect.anything(),
        notifications: expect.anything(),
        rpcInterfaces: [
          IModelReadRpcInterface,
          IModelTileRpcInterface,
          PresentationRpcInterface,
          SnapshotIModelRpcInterface,
          IModelWriteRpcInterface,
        ],
        uiAdmin: expect.anything(),
        toolAdmin: undefined,
      },
    });
  });

  it("initializes the Viewer with the provided backend configuration", async () => {
    jest.spyOn(WebInitializer, "startWebViewer");

    const backendConfig: IModelBackendOptions = {
      customBackend: {
        rpcParams: {
          info: {
            title: "myBackend",
            version: "v1.0",
          },
        },
      },
    };

    const { getByTestId } = render(
      <Viewer
        authConfig={{ config: authConfig }}
        contextId={mockProjectId}
        iModelId={mockIModelId}
        backend={backendConfig}
      />
    );

    await waitFor(() => getByTestId("mock-div"));

    expect(WebInitializer.startWebViewer).toHaveBeenCalledWith({
      authConfig: { config: authConfig },
      backend: backendConfig,
      contextId: mockProjectId,
      iModelId: mockIModelId,
    });
  });
});
