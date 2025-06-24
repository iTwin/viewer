/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { ColorTheme, UiFramework, UiItemsManager } from "@itwin/appui-react";
import { BeEvent } from "@itwin/core-bentley";
import { Cartographic, ColorDef } from "@itwin/core-common";
import { BlankConnection } from "@itwin/core-frontend";
import { Range3d } from "@itwin/core-geometry";
import * as unifiedSelection from "@itwin/unified-selection";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import { IModelViewer } from "../../../components/iModel/index.js";
import IModelLoader from "../../../components/iModel/IModelLoader.js";
import * as IModelServices from "../../../services/iModel/IModelService.js";
import type {
  BlankConnectionViewState,
  BlankViewerProps,
  ViewerFrontstage,
} from "../../../types.js";
import { TestUiProvider, TestUiProvider2 } from "../../mocks/MockUiProviders.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react-redux", async () => {
  const original = await vi.importActual<typeof import("react-redux")>("react-redux");

  return {
    ...original,
    Provider: vi.fn().mockImplementation(({ children }: any) => children),
  }
});

vi.mock("@itwin/appui-react", async (importActual) => {
  const original = await importActual<typeof import("@itwin/appui-react")>();

  const mockStore = {
    getState: vi.fn(),
    dispatch: vi.fn(),
    subscribe: vi.fn(),
    replaceReducer: vi.fn(),
  };

  return {
    ...original,
    StateManager: Object.create(original.StateManager, {
      store: {
        get: vi.fn(() => mockStore),
      },
    }),
    UiItemsManager: Object.create(original.UiItemsManager, {
      getBackstageItems: {
        value: vi.fn().mockReturnValue([]),
      }
    }),
  }
});

vi.mock("@itwin/appui-abstract");

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

vi.mock("@itwin/core-frontend", async () => {
  const { BeEvent } = await import("@itwin/core-bentley"); // Needed here because mock is hoisted at the top before all imports.

  return {
    IModelApp: {
      startup: vi.fn(),
      telemetry: {
        addClient: vi.fn(),
      },
      localization: {
        getLocalizedString: vi.fn(),
        registerNamespace: vi.fn().mockResolvedValue(true),
      },
      uiAdmin: {
        updateFeatureFlags: vi.fn(),
      },
      notifications: {
        openMessageBox: vi.fn(),
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
    MessageBoxType: {
      Ok: 1,
    },
    MessageBoxIconType: {
      Critical: 1,
    },
    BlankConnection: {
      create: vi.fn().mockReturnValue({
        isBlankConnection: () => true,
        isOpen: true,
        close: vi.fn(),
        selectionSet: {
          onChanged: new BeEvent<any>(),
          elements: new Set()
        },
      } as any),
    },
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class { },
    AccuSnap: class { },
    ToolAdmin: class { },
    WebViewerApp: {
      startup: vi.fn().mockResolvedValue(true),
    },
    ViewCreator3d: vi.fn().mockImplementation(() => {
      return {
        createDefaultView: vi.fn().mockResolvedValue({}),
      };
    }),
    SpatialViewState: {
      className: "",
    },
    DrawingViewState: {
      className: "",
    },
    SheetViewState: {
      className: "",
    },
  };
});

vi.mock("../../../services/iModel/IModelService");

vi.mock("../../../components/iModel/IModelViewer", () => ({
  __esModule: true,
  IModelViewer: vi.fn(() => <div data-testid="viewer"></div>),
}));

vi.mock("@itwin/unified-selection", { spy: true });

vi.mocked(unifiedSelection.enableUnifiedSelectionSyncWithIModel)
  .mockImplementation(() => {
    return vi.fn();
  });

const mockITwinId = "mockITwinId";
const mockIModelId = "mockIModelId";

describe("IModelLoader", () => {
  beforeEach(() => {
    vi.spyOn(IModelServices, "openRemoteIModel").mockResolvedValue({
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: vi.fn(),
      isOpen: true,
      selectionSet: {
        onChanged: new BeEvent<any>(),
        elements: new Set()
      },
    } as any);

    vi.spyOn(IModelServices, "openLocalIModel").mockResolvedValue({
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: vi.fn(),
      isOpen: true,
      selectionSet: {
        onChanged: new BeEvent<any>(),
        elements: new Set()
      },
    } as any);

  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("registers and unregisters ui providers", async () => {
    vi.spyOn(UiItemsManager, "register");
    vi.spyOn(UiItemsManager, "unregister");

    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        uiProviders={[new TestUiProvider()]}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));
    expect(UiItemsManager.register).toHaveBeenCalledTimes(1);

    result.rerender(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        uiProviders={[new TestUiProvider2()]}
      />
    );

    await waitFor(() => result.getByTestId("viewer"));
    expect(UiItemsManager.unregister).toHaveBeenCalledTimes(1);
  });

  it("creates a blank connection with iTwinId passed in blankConnection", async () => {
    const blankConnectionProps = {
      location: Cartographic.fromDegrees({
        longitude: 0,
        latitude: 0,
        height: 0,
      }),
      extents: new Range3d(-30, -30, -30, 30, 30, 30),
      iTwinId: mockITwinId,
    };

    const blankConnectionViewState: BlankConnectionViewState = {
      setAllow3dManipulations: true,
      displayStyle: {
        backgroundColor: ColorDef.blue,
      },
    };

    const { getByTestId } = render(
      <IModelLoader
        {...blankConnectionProps}
        blankConnectionViewState={blankConnectionViewState}
      />
    );

    await waitFor(() => getByTestId("viewer"));
    expect(BlankConnection.create).toHaveBeenCalledWith({
      ...blankConnectionProps,
      name: "Blank Connection",
    });
  });

  it("creates a blank connection with iTwinId passed separate from blankConnection", async () => {
    const blankConnectionProps: BlankViewerProps = {
      location: Cartographic.fromDegrees({
        longitude: 0,
        latitude: 0,
        height: 0,
      }),
      extents: new Range3d(-30, -30, -30, 30, 30, 30),
    };

    const blankConnectionViewState: BlankConnectionViewState = {
      setAllow3dManipulations: true,
      displayStyle: {
        backgroundColor: ColorDef.blue,
      },
    };

    const { getByTestId } = render(
      <IModelLoader
        {...blankConnectionProps}
        blankConnectionViewState={blankConnectionViewState}
        iTwinId={mockITwinId}
      />
    );

    await waitFor(() => getByTestId("viewer"));
    expect(BlankConnection.create).toHaveBeenCalledWith({
      ...blankConnectionProps,
      iTwinId: mockITwinId,
      name: "Blank Connection",
    });
  });

  it("creates a remote connection from iModelId and iTwinId", async () => {
    const { getByTestId } = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );

    await waitFor(() => getByTestId("viewer"));
    expect(IModelServices.openRemoteIModel).toHaveBeenCalledWith(
      mockITwinId,
      mockIModelId,
      undefined // optional changesetId
    );
  });

  it("creates a local connection from filePath", async () => {
    const { getByTestId } = render(<IModelLoader filePath="x://iModel" />);

    await waitFor(() => getByTestId("viewer"));
    expect(IModelServices.openLocalIModel).toHaveBeenCalledWith(
      "x://iModel",
      undefined
    );
  });

  it.skip("sets the theme to the provided theme", async () => {
    const { getByTestId } = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
      // theme={ColorTheme.Dark}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));
    expect(UiFramework.setColorTheme).toHaveBeenCalledWith(ColorTheme.Dark); // eslint-disable-line @typescript-eslint/no-deprecated
  });

  it("synchronizes with unified selection storage when storage provided", async () => {
    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: vi.fn(),
      getRpcProps: vi.fn(),
      selectionSet: {
        onChanged: new BeEvent<any>(),
        elements: new Set()
      },
    };

    vi.spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        selectionStorage={unifiedSelection.createStorage()}
      />
    );
    await waitFor(() => result.getByTestId("viewer"));
    expect(unifiedSelection.enableUnifiedSelectionSyncWithIModel).toHaveBeenCalled();
  });

  it("renders without a viewState if the default frontstage does not require a connection", async () => {
    const frontstages: ViewerFrontstage[] = [
      {
        default: true,
        provider: {} as any,
      },
    ];
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        frontstages={frontstages}
      />
    );
    await waitFor(() => result.getByTestId("viewer"));
    expect(IModelViewer).toHaveBeenCalledWith(
      { backstageItems: undefined, frontstages },
      {}
    );
  });

  it("closes connection on unmount", async () => {
    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: vi.fn(),
      selectionSet: {
        onChanged: new BeEvent<any>(),
        elements: new Set()
      },
    };

    vi.spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);

    const result = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));
    expect(unifiedSelection.enableUnifiedSelectionSyncWithIModel).not.toHaveBeenCalled();
    result.unmount();
    await waitFor(() => {
      expect(connection.close).toHaveBeenCalled();
    });
  });

  it("closes connection between model ids change", async () => {
    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: vi.fn(),
      selectionSet: {
        onChanged: new BeEvent<any>(),
        elements: new Set()
      },
    };

    vi.spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));

    result.rerender(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId + "1"} />
    );

    await waitFor(() => result.getByTestId("viewer"));

    await waitFor(() => {
      expect(connection.close).toHaveBeenCalled();
    });
  });

  it("closes connection between iTwin ids change", async () => {
    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: vi.fn(),
      selectionSet: {
        onChanged: new BeEvent<any>(),
        elements: new Set()
      },
    };
    vi.spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));

    result.rerender(
      <IModelLoader iTwinId={mockITwinId + "1"} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));
    await waitFor(() => {
      expect(connection.close).toHaveBeenCalled();
    });
  });

  it("renders a custom loading component", async () => {
    vi.spyOn(IModelServices, "openRemoteIModel").mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                isBlankConnection: () => false,
                iModelId: mockIModelId,
                close: vi.fn(),
                isOpen: true,
                selectionSet: {
                  onChanged: new BeEvent<any>(),
                  elements: new Set()
                },
              } as any),
            500
          )
        )
    );

    const Loader = () => {
      return <div>Things are happening</div>;
    };
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        loadingComponent={<Loader />}
      />
    );

    const loadingComponent = await waitFor(() =>
      result.getByText("Things are happening")
    );

    expect(loadingComponent).toBeInTheDocument();
  });
});
