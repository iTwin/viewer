/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@testing-library/jest-dom/extend-expect";

import { SnapshotConnection } from "@bentley/imodeljs-frontend";
import { UiCore } from "@bentley/ui-core";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import { BaseViewer } from "../..";
import * as IModelService from "../../services/iModel/IModelService";

jest.mock("../../services/iModel/IModelService");
jest.mock("@bentley/ui-framework", () => {
  return {
    ...jest.createMockFromModule<any>("@bentley/ui-framework"),
    UiFramework: {
      ...jest.createMockFromModule<any>("@bentley/ui-framework").UiFramework,
      initialize: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  };
});
jest.mock("@bentley/presentation-frontend", () => {
  return {
    ...jest.createMockFromModule<any>("@bentley/presentation-frontend"),
    Presentation: {
      ...jest.createMockFromModule<any>("@bentley/presentation-frontend")
        .Presentation,
      initialize: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  };
});
jest.mock("react-i18next");

jest.mock("@microsoft/applicationinsights-react-js", () => ({
  ReactPlugin: jest.fn(),
  withAITracking: (
    _reactPlugin: any | undefined, // eslint-disable-line no-unused-vars
    component: any,
    _componentName?: string, // eslint-disable-line no-unused-vars
    _className?: string // eslint-disable-line no-unused-vars
  ) => component,
}));

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
        unregisterNamespace: jest.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
      authorizationClient: {
        hasSignedIn: true,
        isAuthorized: true,
        onUserStateChanged: {
          addListener: jest.fn(),
        },
      },
      viewManager: {
        onViewOpen: {
          addOnce: jest.fn(),
        },
      },
      shutdown: jest.fn().mockImplementation(() => Promise.resolve()),
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
  };
});

jest.mock("../../services/telemetry/TelemetryService");
jest.mock("@bentley/property-grid-react", () => {
  return {
    ...jest.createMockFromModule<any>("@bentley/property-grid-react"),
    PropertyGridManager: {
      ...jest.createMockFromModule<any>("@bentley/property-grid-react")
        .PropertyGridManager,
      initialize: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  };
});

const mockProjectId = "123";
const mockIModelId = "456";

describe("BaseViewer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (UiCore.initialized) {
      UiCore.terminate();
    }
  });

  it("loads the model loader for the specified contextId and iModelId", async () => {
    const { getByTestId } = render(
      <BaseViewer contextId={mockProjectId} iModelId={mockIModelId} />
    );

    const viewerContainer = await waitFor(() => getByTestId("loader-wrapper"));

    expect(viewerContainer).toBeInTheDocument();
  });

  it("queries the iModel with the provided changeSetId", async () => {
    const { getByTestId } = render(
      <BaseViewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        productId={"0000"}
        changeSetId={"123"}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(IModelService.openRemoteImodel).toHaveBeenCalledWith(
      mockProjectId,
      mockIModelId,
      "123"
    );
  });

  it("ensures that either a contextId/iModelId combination or a local snapshot is provided", async () => {
    const events = {
      onError: (event: ErrorEvent) => {
        event.preventDefault();
      },
    };

    jest.spyOn(events, "onError");

    window.addEventListener("error", events.onError);

    const { getByTestId } = render(<BaseViewer />);

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).not.toBeInTheDocument();
    expect(events.onError).toHaveBeenCalled();

    window.removeEventListener("error", events.onError);
  });

  it("renders and establishes a SnapshotConnection if a local snapshot is provided", async () => {
    const snapshotPath = "/path/to/snapshot";

    const { getByTestId } = render(<BaseViewer snapshotPath={snapshotPath} />);

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).toBeInTheDocument();
    expect(SnapshotConnection.openFile).toHaveBeenCalledWith(snapshotPath);
  });

  it("executes a callback after IModelApp is initialized", async () => {
    const callbacks = {
      onIModelAppInit: jest.fn(),
    };
    const { getByTestId } = render(
      <BaseViewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        onIModelAppInit={callbacks.onIModelAppInit}
      />
    );

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).toBeInTheDocument();
    expect(callbacks.onIModelAppInit).toHaveBeenCalled();
  });
});
