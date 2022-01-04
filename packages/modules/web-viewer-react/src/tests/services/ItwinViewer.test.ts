/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React from "react";
import ReactDOM from "react-dom";

import { Viewer } from "../../components/Viewer";
import { WebInitializer } from "../../services/Initializer";
import { ItwinViewer } from "../../services/ItwinViewer";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient";

jest.mock("@itwin/viewer-react", () => {
  return {
    BaseViewer: jest.fn(() => null),
    getIModelAppOptions: jest.fn().mockReturnValue({}),
    useIsMounted: jest.fn().mockReturnValue(true),
    useBaseViewerInitializer: jest.fn().mockReturnValue(true),
    getInitializationOptions: jest.fn().mockReturnValue({}),
    isEqual: jest.fn().mockReturnValue(true),
    ViewerPerformance: {
      addMark: jest.fn(),
      addAndLogMeasure: jest.fn(),
      enable: jest.fn(),
    },
    makeCancellable: jest.requireActual(
      "@itwin/viewer-react/lib/cjs/utilities/MakeCancellable"
    ).makeCancellable,
    ViewerAuthorization: {
      client: {},
    },
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
const mockITwinId = "mockITwinId";
const mockiModelId = "mockImodelId";
const authConfig = new MockAuthorizationClient();

describe("iTwinViewer", () => {
  beforeAll(() => {
    const viewerRoot = document.createElement("div");
    viewerRoot.id = elementId;
    document.body.append(viewerRoot);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the viewer for the proper iTwinId and iModelId on the element whose id is passed to the constructor", async () => {
    jest.spyOn(React, "createElement");
    jest.spyOn(ReactDOM, "render");
    const viewer = new ItwinViewer({
      elementId,
      authConfig,
      enablePerformanceMonitors: false,
    });
    await viewer.load({ iTwinId: mockITwinId, iModelId: mockiModelId });
    await WebInitializer.initialized;
    expect(React.createElement).toHaveBeenCalledWith(Viewer, {
      iTwinId: mockITwinId,
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
      enablePerformanceMonitors: false,
    });
    expect(ReactDOM.render).toHaveBeenCalledWith(
      expect.anything(),
      document.getElementById(elementId)
    );
  });
});
