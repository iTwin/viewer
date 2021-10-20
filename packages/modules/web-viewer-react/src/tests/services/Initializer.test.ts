/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BrowserAuthorizationClientConfiguration } from "@itwin/browser-authorization";
import { IModelApp } from "@itwin/core-frontend";
import { UiCore } from "@itwin/core-react";

import { WebInitializer } from "../../services/Initializer";

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
jest.mock("@microsoft/applicationinsights-react-js", () => ({
  ReactPlugin: jest.fn(),
  withAITracking: (
    _reactPlugin: any | undefined, // eslint-disable-line no-unused-vars
    component: any,
    _componentName?: string, // eslint-disable-line no-unused-vars
    _className?: string // eslint-disable-line no-unused-vars
  ) => component,
}));
jest.mock("@itwin/viewer-react", () => {
  return {
    ...jest.createMockFromModule<any>("@itwin/viewer-react"),
    makeCancellable: jest.requireActual(
      "@itwin/viewer-react/lib/utilities/MakeCancellable"
    ).makeCancellable,
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
    await WebInitializer.startWebViewer();
    expect(IModelApp.startup).toHaveBeenCalled();
  });
});
