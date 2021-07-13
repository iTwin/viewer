/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { FrontendApplicationInsightsClient } from "@bentley/frontend-application-insights-client";
import { BrowserAuthorizationClientConfiguration } from "@bentley/frontend-authorization-client";
import { UiCore } from "@bentley/ui-core";

import { WebInitializer } from "../../services/Initializer";

jest.mock("@bentley/imodeljs-frontend", () => {
  const noMock = jest.requireActual("@bentley/imodeljs-frontend");
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
  };
});
jest.mock("@bentley/frontend-application-insights-client");
jest.mock("@microsoft/applicationinsights-react-js", () => ({
  ReactPlugin: jest.fn(),
  withAITracking: (
    reactPlugin: any | undefined, // eslint-disable-line no-unused-vars
    component: any,
    componentName?: string, // eslint-disable-line no-unused-vars
    className?: string // eslint-disable-line no-unused-vars
  ) => component,
}));
jest.mock("@itwin/viewer-react");

const authConfig: BrowserAuthorizationClientConfiguration = {
  clientId: "test-client",
  scope: "test-scope",
  responseType: "code",
  redirectUri: "http://localhost",
};

describe("Initializer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (UiCore.initialized) {
      UiCore.terminate();
    }
  });

  it("adds the iTwin.js telemetry client when the imjs key is provided", async () => {
    const imjsAppInsightsKey = "456";
    await WebInitializer.startWebViewer({
      authConfig: { config: authConfig },
      imjsAppInsightsKey: imjsAppInsightsKey,
    });

    await WebInitializer.initialized;

    expect(FrontendApplicationInsightsClient).toHaveBeenCalledWith(
      imjsAppInsightsKey
    );
  });

  it("does not add the iTwin.js telemetry client when the imjs key is not provided", async () => {
    await WebInitializer.startWebViewer();

    await WebInitializer.initialized;

    expect(FrontendApplicationInsightsClient).not.toHaveBeenCalled();
  });
});
