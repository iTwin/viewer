/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@testing-library/jest-dom/extend-expect";

import { ColorTheme, UiFramework, UiItemsManager } from "@itwin/appui-react";
import { Cartographic, ColorDef } from "@itwin/core-common";
import { BlankConnection, SnapshotConnection } from "@itwin/core-frontend";
import { Range3d } from "@itwin/core-geometry";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import { IModelViewer } from "../../../components/iModel";
import IModelLoader from "../../../components/iModel/IModelLoader";
import * as IModelServices from "../../../services/iModel/IModelService";
import type {
  BlankConnectionViewState,
  BlankViewerProps,
  ViewerFrontstage,
} from "../../../types";
import { TestUiProvider, TestUiProvider2 } from "../../mocks/MockUiProviders";

jest.mock("react-redux", () => ({
  ...jest.requireActual<any>("react-redux"),
  Provider: jest.fn().mockImplementation(({ children }: any) => children),
}));

jest.mock("@itwin/appui-react", () => {
  return {
    ...jest.createMockFromModule<any>("@itwin/appui-react"),
    StateManager: {
      ...jest.createMockFromModule<any>("@itwin/appui-react").StateManager,
      store: jest.fn(),
    },
  };
});
jest.mock("@itwin/appui-abstract");
jest.mock("@itwin/core-frontend", () => {
  return {
    IModelApp: {
      startup: jest.fn(),
      telemetry: {
        addClient: jest.fn(),
      },
      localization: {
        getLocalizedString: jest.fn(),
        registerNamespace: jest.fn().mockResolvedValue(true),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
      notifications: {
        openMessageBox: jest.fn(),
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
    MessageBoxType: {
      Ok: 1,
    },
    MessageBoxIconType: {
      Critical: 1,
    },
    BlankConnection: {
      create: jest.fn().mockReturnValue({
        isBlankConnection: () => true,
        isOpen: true,
      } as any),
    },
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class {},
    AccuSnap: class {},
    ToolAdmin: class {},
    WebViewerApp: {
      startup: jest.fn().mockResolvedValue(true),
    },
    ViewCreator3d: jest.fn().mockImplementation(() => {
      return {
        createDefaultView: jest.fn().mockResolvedValue({}),
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
jest.mock("../../../services/iModel/IModelService");

jest.mock("../../../components/iModel/IModelViewer", () => ({
  __esModule: true,
  IModelViewer: jest.fn(() => <div data-testid="viewer"></div>),
}));

const mockITwinId = "mockITwinId";
const mockIModelId = "mockIModelId";

describe("IModelLoader", () => {
  beforeEach(() => {
    jest.spyOn(IModelServices, "openRemoteIModel").mockResolvedValue({
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: jest.fn(),
      isOpen: true,
    } as any);
    jest.spyOn(SnapshotConnection, "openFile").mockResolvedValue({
      isBlankConnection: () => true,
      isOpen: true,
    } as any);

    jest.spyOn(IModelServices, "openLocalIModel").mockResolvedValue({
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: jest.fn(),
      isOpen: true,
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("registers and unregisters ui providers", async () => {
    jest.spyOn(UiItemsManager, "register");
    jest.spyOn(UiItemsManager, "unregister");

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

  it("sets the theme to the provided theme", async () => {
    const { getByTestId } = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        theme={ColorTheme.Dark}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(UiFramework.setColorTheme).toHaveBeenCalledWith(ColorTheme.Dark);
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
      close: jest.fn(),
    };
    jest
      .spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );
    await waitFor(() => result.getByTestId("viewer"));

    result.unmount();

    expect(connection.close).toHaveBeenCalled();
  });

  it("closes connection between model ids change", async () => {
    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: jest.fn(),
    };
    jest
      .spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));

    result.rerender(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId + "1"} />
    );

    await waitFor(() => result.getByTestId("viewer"));
    expect(connection.close).toHaveBeenCalled();
  });

  it("closes connection between iTwin ids change", async () => {
    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: jest.fn(),
    };
    jest
      .spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));

    result.rerender(
      <IModelLoader iTwinId={mockITwinId + "1"} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));
    expect(connection.close).toHaveBeenCalled();
  });

  it("renders a custom loading component", async () => {
    jest.spyOn(IModelServices, "openRemoteIModel").mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                isBlankConnection: () => false,
                iModelId: mockIModelId,
                close: jest.fn(),
                isOpen: true,
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
