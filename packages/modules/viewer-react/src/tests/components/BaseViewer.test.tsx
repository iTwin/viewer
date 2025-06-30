/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { UiCore } from '@itwin/core-react';
import { BaseViewer } from "../../components/BaseViewer.js";
import * as IModelService from "../../services/iModel/IModelService.js";

vi.mock("@itwin/presentation-frontend", async (importActual) => {
  const original = await importActual<typeof import("@itwin/presentation-frontend")>();

  return {
    ...original,
    Presentation: {
      ...original.Presentation,
      initialize: vi.fn().mockImplementation(() => Promise.resolve()),
      registerInitializationHandler: vi.fn().mockImplementation(() => Promise.resolve()),
      selection: {
        scopes: {
          getSelectionScopes: vi.fn(async () => []),
        },
      },
    },
  };
});

vi.mock("@itwin/core-frontend", async (importActual) => {
  const original = await importActual<typeof import("@itwin/core-frontend")>();

  return {
    ...original,
    IModelApp: {
      initialized: true,
      startup: vi.fn(),
      telemetry: {
        addClient: vi.fn(),
      },
      localization: {
        registerNamespace: vi.fn().mockResolvedValue(true),
        getLanguageList: vi.fn().mockReturnValue(["en-US"]),
        getLocalizedString: vi.fn(),
        unregisterNamespace: vi.fn(),
        translateWithNamespace: vi.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: vi.fn(),
      },
      authorizationClient: {
        onAccessTokenChanged: {
          addListener: vi.fn(),
        },
      },
      viewManager: {
        onViewOpen: {
          addOnce: vi.fn(),
        },
      },
      shutdown: vi.fn().mockImplementation(() => Promise.resolve()),
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
    ToolAdmin: class { },
    BriefcaseConnection: {
      openFile: vi.fn(),
    },
  }
});

vi.mock("../../services/iModel/IModelService");
vi.mock("@itwin/appui-react", async (importActual) => {
  const original = await importActual<typeof import("@itwin/appui-react")>();

  return {
    ...original,
    UiFramework: {
      ...original.UiFramework,
      initialize: vi.fn().mockImplementation(() => Promise.resolve()),
    },
    UiItemsManager: {
      ...original.UiItemsManager,
      getBackstageItems: vi.fn().mockReturnValue([]),
    },
  };
});

vi.mock("../../hooks/useAccessToken", () => {
  return { useAccessToken: () => "mockToken" };
});

vi.mock("../../services/BaseInitializer", () => {
  return {
    BaseInitializer: {
      authClient: {
        hasSignedIn: true,
        isAuthorized: true,
        onAccessTokenChanged: {
          addListener: vi.fn(),
        },
      },
      initialize: vi.fn().mockResolvedValue(true),
      cancel: vi.fn(),
      shutdown: vi.fn(),
      initialized: Promise.resolve(),
    },
  };
});

const mockITwinId = "123";
const mockIModelId = "456";

describe("BaseViewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (UiCore.initialized) { // eslint-disable-line @typescript-eslint/no-deprecated
      UiCore.terminate(); // eslint-disable-line @typescript-eslint/no-deprecated
    }
  });

  it("loads the model loader for the specified iTwinId and iModelId", async () => {
    const { getByTestId } = render(
      <BaseViewer
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        enablePerformanceMonitors={false}
      />
    );

    const viewerContainer = await waitFor(() => getByTestId("loader-wrapper"));

    expect(viewerContainer).toBeInTheDocument();;
  });

  it("queries the iModel with the provided changeSetId", async () => {
    const { getByTestId } = render(
      <BaseViewer
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        productId={"0000"}
        changeSetId={"123"}
        enablePerformanceMonitors={false}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(IModelService.openRemoteIModel).toHaveBeenCalledWith(
      mockITwinId,
      mockIModelId,
      "123"
    );
  });

  it("renders and attempts to create a briefcase connection or snapshot connection if a local path is provided", async () => {
    const fileName = "/path/to/snapshot";

    const { getByTestId } = render(
      <BaseViewer filePath={fileName} enablePerformanceMonitors={false} />
    );

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).toBeInTheDocument();
    expect(IModelService.openLocalIModel).toHaveBeenCalledWith(
      fileName,
      undefined
    );
  });

  it("renders and attempts to create a briefcase connection in write mode", async () => {
    const fileName = "/path/to/snapshot";

    const { getByTestId } = render(
      <BaseViewer
        filePath={fileName}
        readonly={false}
        enablePerformanceMonitors={false}
      />
    );

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).toBeInTheDocument();
    expect(IModelService.openLocalIModel).toHaveBeenCalledWith(fileName, false);
  });
});