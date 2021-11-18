/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import ReactDOM from "react-dom";

import { Viewer } from "../../components/Viewer";
import { WebInitializer } from "../../services/Initializer";
import { ItwinViewer } from "../../services/ItwinViewer";
import { WebAuthorizationOptions } from "../../types";

jest.mock("@itwin/viewer-react", () => {
  return {
    BaseViewer: jest.fn(({ children }) => null),
    getIModelAppOptions: jest.fn(),
    useIsMounted: jest.fn().mockReturnValue(true),
    useBaseViewerInitializer: jest.fn().mockReturnValue(true),
    getInitializationOptions: jest.fn().mockReturnValue({}),
    isEqual: jest.fn().mockReturnValue(true),
  };
});

jest.mock("@itwin/core-frontend", () => {
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
    await WebInitializer.initialized;
    expect(React.createElement).toHaveBeenCalledWith(Viewer, {
      contextId: mockProjectId,
      iModelId: mockiModelId,
      authConfig: authConfig,
      changeSetId: undefined,
      uiConfig: undefined,
      appInsightsKey: undefined,
      onIModelConnected: undefined,
      frontstages: undefined,
      viewportOptions: undefined,
      uiProviders: undefined,
      theme: undefined,
    });
    expect(ReactDOM.render).toHaveBeenCalledWith(
      expect.anything(),
      document.getElementById(elementId)
    );
  });
});
