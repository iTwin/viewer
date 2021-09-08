/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Config } from "@bentley/bentleyjs-core";
import { Range3d } from "@bentley/geometry-core";
import { Cartographic, ColorDef } from "@bentley/imodeljs-common";
import {
  BlankConnection,
  BlankConnectionProps,
  IModelApp,
  SnapshotConnection,
} from "@bentley/imodeljs-frontend";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import { BackstageItemUtilities, UiItemsManager } from "@bentley/ui-abstract";
import {
  ColorTheme,
  FrontstageProps,
  FrontstageProvider,
  IModelViewportControlOptions,
  StateManager,
  UiFramework,
} from "@bentley/ui-framework";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import { IModelViewer } from "../../../components/iModel";
import IModelLoader from "../../../components/iModel/IModelLoader";
import { ViewCreator3d } from "../../../services/iModel";
import * as IModelServices from "../../../services/iModel/IModelService";
import { createBlankViewState } from "../../../services/iModel/ViewCreatorBlank";
import {
  BlankConnectionViewState,
  ViewerBackstageItem,
  ViewerFrontstage,
} from "../../../types";
import { TestUiProvider, TestUiProvider2 } from "../../mocks/MockUiProviders";

jest.mock("react-redux", () => ({
  ...jest.requireActual<any>("react-redux"),
  Provider: jest.fn().mockImplementation(({ children }: any) => children),
}));

jest.mock("@bentley/ui-framework", () => {
  return {
    ...jest.createMockFromModule<any>("@bentley/ui-framework"),
    StateManager: {
      ...jest.createMockFromModule<any>("@bentley/ui-framework").StateManager,
      store: jest.fn(),
    },
  };
});
jest.mock("@bentley/ui-abstract");
jest.mock("@microsoft/applicationinsights-react-js", () => ({
  ReactPlugin: jest.fn(),
  withAITracking: (
    reactPlugin: any | undefined, // eslint-disable-line no-unused-vars
    component: any,
    componentName?: string, // eslint-disable-line no-unused-vars
    className?: string // eslint-disable-line no-unused-vars
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
        translate: jest.fn(),
        translateWithNamespace: jest.fn(),
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
      create: jest
        .fn()
        .mockReturnValue({ isBlankConnection: () => true } as any),
    },
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class { },
    ToolAdmin: class { },
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
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

class Frontstage2Provider extends FrontstageProvider {
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

const mockContextId = "mockContextId";
const mockIModelId = "mockIModelId";

describe("IModelLoader", () => {
  beforeEach(() => {
    jest.spyOn(IModelServices, "openRemoteImodel").mockResolvedValue({
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: jest.fn()
    } as any);
    jest
      .spyOn(UrlDiscoveryClient.prototype, "discoverUrl")
      .mockResolvedValue("https://test.com");
    jest.spyOn(Config.App, "get").mockReturnValue(1);
    jest
      .spyOn(SnapshotConnection, "openFile")
      .mockResolvedValue({ isBlankConnection: () => true } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("registers and unregisters ui providers", async () => {
    jest.spyOn(UiItemsManager, "register");
    jest.spyOn(UiItemsManager, "unregister");

    const result = render(
      <IModelLoader
        contextId={mockContextId}
        iModelId={mockIModelId}
        uiProviders={[new TestUiProvider()]}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiItemsManager.register).toHaveBeenCalledTimes(3);

    result.rerender(
      <IModelLoader
        contextId={mockContextId}
        iModelId={mockIModelId}
        uiProviders={[new TestUiProvider2()]}
      />
    );

    await waitFor(() => result.getByTestId("viewer"));

    expect(UiItemsManager.unregister).toHaveBeenCalledTimes(3);
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
        contextId={mockContextId}
        iModelId={mockIModelId}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    // these calls will be doubled. items will be set first without a viewState and reset with one additional translation for the default frontstage once we have a viewState
    expect(BackstageItemUtilities.createStageLauncher).toHaveBeenCalledTimes(2);
    expect(BackstageItemUtilities.createActionItem).toHaveBeenCalledTimes(2);
    expect(IModelApp.i18n.translate).toHaveBeenCalledTimes(5);
  });

  it("creates a blank connection and a blank ViewState", async () => {
    const blankConnection: BlankConnectionProps = {
      name: "GeometryConnection",
      location: Cartographic.fromDegrees(0, 0, 0),
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
        contextId={mockContextId}
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
      <IModelLoader contextId={mockContextId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).toHaveBeenCalled();
  });

  it("uses the provided viewstate when connection imodelid matches viewstate imodelid", async () => {
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: IModelViewportControlOptions = {
      viewState: {
        iModel: {
          iModelId: mockIModelId,
        },
      } as any,
    };
    const result = render(
      <IModelLoader
        contextId={mockContextId}
        iModelId={mockIModelId}
        viewportOptions={viewportOptions}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiFramework.setDefaultViewState).not.toHaveBeenCalled();
  });

  it("creates a default viewstate when connection imodelid does not match viewstate imodelid", async () => {
    jest.spyOn(IModelServices, "openRemoteImodel").mockResolvedValue({
      isBlankConnection: () => false,
      iModelId: undefined,
      close: jest.fn()
    } as any);
    jest.spyOn(UiFramework, "setDefaultViewState");
    const viewportOptions: IModelViewportControlOptions = {
      viewState: {
        iModel: {
          iModelId: mockIModelId,
        },
      } as any,
    };
    const result = render(
      <IModelLoader
        contextId={mockContextId}
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
        contextId={mockContextId}
        iModelId={mockIModelId}
        frontstages={frontstages}
      />
    );
    await waitFor(() => result.getByTestId("viewer"));
    expect(IModelViewer).toHaveBeenCalledWith(
      { backstageItems: [], frontstages, uiFrameworkVersion: undefined },
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
      .spyOn(IModelServices, "openRemoteImodel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader contextId={mockContextId} iModelId={mockIModelId} />
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
      .spyOn(IModelServices, "openRemoteImodel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader contextId={mockContextId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));

    result.rerender(
      <IModelLoader contextId={mockContextId} iModelId={mockIModelId + "1"} />
    );

    await waitFor(() => result.getByTestId("viewer"));
    expect(connection.close).toHaveBeenCalled();
  });

  it("closes connection between context ids change", async () => {
    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: jest.fn(),
    };
    jest
      .spyOn(IModelServices, "openRemoteImodel")
      .mockResolvedValue(connection as any);
    const result = render(
      <IModelLoader contextId={mockContextId} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));

    result.rerender(
      <IModelLoader contextId={mockContextId + "1"} iModelId={mockIModelId} />
    );

    await waitFor(() => result.getByTestId("viewer"));
    expect(connection.close).toHaveBeenCalled();
  });
});
