/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@testing-library/jest-dom/extend-expect";

import { BackstageItemUtilities, UiItemsManager } from "@itwin/appui-abstract";
import type { FrontstageProps } from "@itwin/appui-react";
import {
  ColorTheme,
  FrontstageProvider,
  UiFramework,
} from "@itwin/appui-react";
import { Cartographic, ColorDef } from "@itwin/core-common";
import type {
  BlankConnectionProps,
  IModelConnection,
} from "@itwin/core-frontend";
import {
  BlankConnection,
  IModelApp,
  SnapshotConnection,
} from "@itwin/core-frontend";
import { Range3d } from "@itwin/core-geometry";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import { IModelViewer } from "../../../components/iModel";
import IModelLoader from "../../../components/iModel/IModelLoader";
import * as IModelServices from "../../../services/iModel/IModelService";
import { createBlankViewState } from "../../../services/iModel/ViewCreatorBlank";
import type {
  BlankConnectionViewState,
  ViewerBackstageItem,
  ViewerFrontstage,
  ViewerViewportControlOptions,
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
jest.mock("@microsoft/applicationinsights-react-js", () => ({
  ReactPlugin: jest.fn(),
  withAITracking: (
    reactPlugin: any | undefined, // eslint-disable-line no-unused-vars
    component: any,
    componentName?: string, // eslint-disable-line no-unused-vars
    className?: string // eslint-disable-line no-unused-vars
  ) => component,
}));
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
    ToolAdmin: class {},
    WebViewerApp: {
      startup: jest.fn().mockResolvedValue(true),
    },
    ViewCreator3d: jest.fn().mockImplementation(() => {
      return {
        createDefaultView: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});
jest.mock("../../../services/iModel/IModelService");
jest.mock("@bentley/itwin-client");
jest.mock("../../../services/iModel/ViewCreatorBlank", () => {
  return {
    createBlankViewState: jest.fn().mockResolvedValue({}),
  };
});
jest.mock("../../../services/iModel/ViewCreator3d", () => {
  return {
    ViewCreator3d: jest.fn().mockImplementation(() => {
      return {
        createDefaultView: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

jest.mock("../../../components/iModel/IModelViewer", () => ({
  __esModule: true,
  IModelViewer: jest.fn(() => <div data-testid="viewer"></div>),
}));

class Frontstage1Provider extends FrontstageProvider {
  public id = "Frontstage1";
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

class Frontstage2Provider extends FrontstageProvider {
  public id = "Frontstage2";
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

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

    // TODO 3.0 - update called times as default providers are re-added
    expect(UiItemsManager.register).toHaveBeenCalledTimes(1);

    result.rerender(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        uiProviders={[new TestUiProvider2()]}
      />
    );

    await waitFor(() => result.getByTestId("viewer"));

    // TODO 3.0 - update called times as default providers are re-added
    expect(UiItemsManager.unregister).toHaveBeenCalledTimes(1);
  });

  it("adds backstage items and translates their labels", async () => {
    const fs1 = new Frontstage1Provider();
    const fs2 = new Frontstage2Provider();
    const frontstages: ViewerFrontstage[] = [
      {
        provider: fs1,
      },
      {
        provider: fs2,
      },
    ];

    const actionItem = {
      id: "bs1",
      execute: jest.fn(),
      groupPriority: 100,
      itemPriority: 1,
      label: "",
      labeli18nKey: "bs1Key",
    };

    const stageLauncher = {
      id: "bs2",
      stageId: "bs2",
      groupPriority: 100,
      itemPriority: 2,
      label: "",
      labeli18nKey: "bs2Key",
    };

    const backstageItems: ViewerBackstageItem[] = [actionItem, stageLauncher];

    const { getByTestId } = render(
      <IModelLoader
        frontstages={frontstages}
        backstageItems={backstageItems}
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    // these calls will be doubled. items will be set first without a viewState and reset with one additional translation for the default frontstage once we have a viewState
    expect(BackstageItemUtilities.createStageLauncher).toHaveBeenCalledTimes(2);
    expect(BackstageItemUtilities.createActionItem).toHaveBeenCalledTimes(2);
    expect(IModelApp.localization.getLocalizedString).toHaveBeenCalledTimes(5);
  });

  it("creates a blank connection and a blank ViewState", async () => {
    const blankConnection: BlankConnectionProps = {
      name: "GeometryConnection",
      location: Cartographic.fromDegrees({
        longitude: 0,
        latitude: 0,
        height: 0,
      }),
      extents: new Range3d(-30, -30, -30, 30, 30, 30),
    };

    const viewStateOptions: BlankConnectionViewState = {
      setAllow3dManipulations: true,
      displayStyle: {
        backgroundColor: ColorDef.blue,
      },
    };

    const { getByTestId } = render(
      <IModelLoader
        blankConnection={blankConnection}
        blankConnectionViewState={viewStateOptions}
      />
    );

    await waitFor(() => getByTestId("viewer"));

    expect(BlankConnection.create).toHaveBeenCalledWith(blankConnection);
    expect(createBlankViewState).toHaveBeenCalledWith(
      expect.anything(),
      viewStateOptions
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

  it("creates a default viewstate", async () => {
    jest.spyOn(UiFramework, "setDefaultViewState");
    const result = render(
      <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).toHaveBeenCalled();
  });

  it("uses the provided viewstate when connection imodelid matches viewstate imodelid", async () => {
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: ViewerViewportControlOptions = {
      viewState: {
        iModel: {
          iModelId: mockIModelId,
        },
      } as any,
    };
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        viewportOptions={viewportOptions}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).not.toHaveBeenCalled();
  });

  it("calls the provided viewstate method when connection getting viewstate", async () => {
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: ViewerViewportControlOptions = {
      viewState: (connection: IModelConnection) =>
        ({
          iModel: connection,
        } as any),
    };
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        viewportOptions={viewportOptions}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).not.toHaveBeenCalled();
  });

  it("awaits the provided viewstate async method when connection getting viewstate", async () => {
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: ViewerViewportControlOptions = {
      viewState: async (connection: IModelConnection) =>
        new Promise((resolve) =>
          resolve({
            iModel: connection,
          })
        ) as any,
    };
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        viewportOptions={viewportOptions}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).not.toHaveBeenCalled();
  });

  it("waits for indefinitely for viewstate when alwaysUseSuppliedViewState is true", async () => {
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: ViewerViewportControlOptions = {
      alwaysUseSuppliedViewState: true,
    };
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        viewportOptions={viewportOptions}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).not.toHaveBeenCalled();
  });

  it("creates a default viewstate alwaysUseSuppliedViewState is false and no viewstate is provided", async () => {
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: ViewerViewportControlOptions = {
      alwaysUseSuppliedViewState: false,
    };
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        viewportOptions={viewportOptions}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).toHaveBeenCalled();
  });

  it("creates a default viewstate when connection imodelid does not match viewstate imodelid", async () => {
    jest.spyOn(IModelServices, "openRemoteIModel").mockResolvedValue({
      isBlankConnection: () => false,
      iModelId: undefined,
      close: jest.fn(),
      isOpen: true,
    } as any);
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: ViewerViewportControlOptions = {
      viewState: {
        iModel: {
          iModelId: mockIModelId,
        },
      } as any,
    };
    const result = render(
      <IModelLoader
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        viewportOptions={viewportOptions}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).toHaveBeenCalled();
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
      { backstageItems: [], frontstages },
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
