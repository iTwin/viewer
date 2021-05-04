/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import ReactDOM from "react-dom";

import { Viewer } from "../../components/Viewer";
import { ItwinViewer } from "../../services/ItwinViewer";
import { WebAuthorizationOptions } from "../../types";

jest.mock("@itwin/viewer-react", () => {
  return {
    BaseViewer: jest.fn(({ children }) => null),
  };
});

jest.mock("@bentley/imodeljs-frontend", () => {
  return {
    IModelApp: {
      startup: jest.fn().mockResolvedValue(true),
      extensionAdmin: {
        addExtensionLoaderFront: jest.fn(),
        loadExtension: jest.fn().mockResolvedValue(true),
      },
      telemetry: {
        addClient: jest.fn(),
      },
      i18n: {
        registerNamespace: jest.fn().mockReturnValue({
          readFinished: jest.fn().mockResolvedValue(true),
        }),
        languageList: jest.fn().mockReturnValue(["en-US"]),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
    },
    SnapMode: {},
    ActivityMessageDetails: jest.fn(),
    PrimitiveTool: jest.fn(),
    NotificationManager: jest.fn(),
    ExternalServerExtensionLoader: jest.fn(),
    Tool: jest.fn(),
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
    },
  };
});

const elementId = "viewerRoot";
const mockProjectId = "mockProjectId";
const mockiModelId = "mockImodelId";
const authConfig: WebAuthorizationOptions = {
  config: {
    clientId: "test-client",
    redirectUri: "http://localhost:3000",
    scope: "test-scope",
  },
};

describe("iTwinViewer", () => {
  beforeAll(() => {
    const viewerRoot = document.createElement("div");
    viewerRoot.id = elementId;
    document.body.append(viewerRoot);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the viewer for the proper contextId and iModelId on the element whose id is passed to the constructor", async () => {
    jest.spyOn(React, "createElement");
    jest.spyOn(ReactDOM, "render");
    const viewer = new ItwinViewer({
      elementId,
      authConfig,
    });
    await viewer.load({ contextId: mockProjectId, iModelId: mockiModelId });
    expect(React.createElement).toHaveBeenCalledWith(Viewer, {
      contextId: mockProjectId,
      iModelId: mockiModelId,
      authConfig: authConfig,
      changeSetId: undefined,
      uiConfig: undefined,
      appInsightsKey: undefined,
      onIModelConnected: undefined,
      frontstages: undefined,
      uiFrameworkVersion: undefined,
      viewportOptions: undefined,
      uiProviders: undefined,
      theme: undefined,
      extensions: undefined,
    });
    expect(ReactDOM.render).toHaveBeenCalledWith(
      expect.anything(),
      document.getElementById(elementId)
    );
  });
});
