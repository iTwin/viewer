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
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

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

const basic = document.createElement("div");
basic.id = "root";
document.body.appendChild(basic);
const container = document.getElementById("root");

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
    const root = createRoot(container!);
    jest.spyOn(UiItemsManager, "register");
    jest.spyOn(UiItemsManager, "unregister");

    act(() =>
      root.render(
        <IModelLoader
          iTwinId={mockITwinId}
          iModelId={mockIModelId}
          uiProviders={[new TestUiProvider()]}
        />
      )
    );

    expect(UiItemsManager.register).toHaveBeenCalledTimes(1);

    act(() =>
      root.render(
        <IModelLoader
          iTwinId={mockITwinId}
          iModelId={mockIModelId}
          uiProviders={[new TestUiProvider2()]}
        />
      )
    );

    expect(UiItemsManager.unregister).toHaveBeenCalledTimes(1);

    act(() => {
      root.unmount();
    });
  });

  it("creates a blank connection with iTwinId passed in blankConnection", async () => {
    const root = createRoot(container!);
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

    act(() =>
      root.render(
        <IModelLoader
          {...blankConnectionProps}
          blankConnectionViewState={blankConnectionViewState}
        />
      )
    );

    expect(BlankConnection.create).toHaveBeenCalledWith({
      ...blankConnectionProps,
      name: "Blank Connection",
    });

    act(() => {
      root.unmount();
    });
  });

  it("creates a blank connection with iTwinId passed separate from blankConnection", async () => {
    const root = createRoot(container!);
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

    act(() =>
      root.render(
        <IModelLoader
          {...blankConnectionProps}
          blankConnectionViewState={blankConnectionViewState}
          iTwinId={mockITwinId}
        />
      )
    );

    expect(BlankConnection.create).toHaveBeenCalledWith({
      ...blankConnectionProps,
      iTwinId: mockITwinId,
      name: "Blank Connection",
    });

    act(() => {
      root.unmount();
    });
  });

  it("creates a remote connection from iModelId and iTwinId", async () => {
    const root = createRoot(container!);
    act(() =>
      root.render(
        <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
      )
    );

    expect(IModelServices.openRemoteIModel).toHaveBeenCalledWith(
      mockITwinId,
      mockIModelId,
      undefined // optional changesetId
    );
    act(() => {
      root.unmount();
    });
  });

  it("creates a local connection from filePath", async () => {
    const root = createRoot(container!);
    act(() => root.render(<IModelLoader filePath="x://iModel" />));

    expect(IModelServices.openLocalIModel).toHaveBeenCalledWith(
      "x://iModel",
      undefined
    );
    act(() => {
      root.unmount();
    });
  });

  it("sets the theme to the provided theme", async () => {
    const root = createRoot(container!);
    act(() =>
      root.render(
        <IModelLoader
          iTwinId={mockITwinId}
          iModelId={mockIModelId}
          theme={ColorTheme.Dark}
        />
      )
    );

    expect(UiFramework.setColorTheme).toHaveBeenCalledWith(ColorTheme.Dark);
    act(() => {
      root.unmount();
    });
  });

  it("renders without a viewState if the default frontstage does not require a connection", async () => {
    const root = createRoot(container!);
    const frontstages: ViewerFrontstage[] = [
      {
        default: true,
        provider: {} as any,
      },
    ];

    act(() =>
      root.render(
        <IModelLoader
          iTwinId={mockITwinId}
          iModelId={mockIModelId}
          frontstages={frontstages}
        />
      )
    );

    expect(IModelViewer).toHaveBeenCalledWith(
      { backstageItems: undefined, frontstages },
      {}
    );
    act(() => {
      root.unmount();
    });
  });

  it("closes connection on unmount", async () => {
    const root = createRoot(container!);

    const connection = {
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      close: jest.fn(),
    };

    jest
      .spyOn(IModelServices, "openRemoteIModel")
      .mockResolvedValue(connection as any);

    act(() =>
      root.render(
        <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
      )
    );

    act(() => {
      root.unmount();
    });

    await waitFor(
      () => {
        expect(connection.close).toHaveBeenCalled();
      },
      { timeout: 9000 }
    );
  }, 9000);
  // it("closes connection between model ids change", async () => {

  //   // const connection = {
  //   //   isBlankConnection: () => false,
  //   //   iModelId: mockIModelId,
  //   //   close: jest.fn(),
  //   // };

  //   // jest.spyOn(IModelServices, "openRemoteIModel").mockImplementation(
  //   //   () =>
  //   //     new Promise((resolve) =>
  //   //       setTimeout(
  //   //         () =>
  //   //           resolve(connection as any),
  //   //         500
  //   //       )
  //   //     )
  //   // );

  //   // jest.spyOn(IModelServices, "openRemoteIModel").mockImplementation(
  //   //   () =>
  //   //     new Promise((resolve) =>
  //   //       setTimeout(
  //   //         () =>
  //   //           resolve({
  //   //             isBlankConnection: () => false,
  //   //             iModelId: mockIModelId + "1",
  //   //             close: jest.fn(),
  //   //           } as any),
  //   //         500
  //   //       )
  //   //     )
  //   // );

  //   const connection = {
  //     isBlankConnection: () => false,
  //     iModelId: mockIModelId,
  //     close: jest.fn(),
  //     isOpen: false,
  //   };
  //   jest
  //     .spyOn(IModelServices, "openRemoteIModel")
  //     .mockResolvedValue(connection as any);

  //   act(() => {
  //     root.render(
  //       <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
  //     );
  //   });

  //   expect(IModelServices.openRemoteIModel).toHaveBeenCalledWith(
  //     mockITwinId,
  //     mockIModelId,
  //     undefined // optional changesetId
  //   );

  //   console.log(connection.iModelId);
  //   act(() => {
  //     root.render(
  //       <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId + "1"} />
  //     );
  //   })

  //   expect(IModelServices.openRemoteIModel).toHaveBeenCalledWith(
  //     mockITwinId,
  //     mockIModelId + "1",
  //     undefined // optional changesetId
  //   );

  //   // expect(connection.close).toHaveBeenCalled();

  // });

  // it("closes connection between iTwin ids change", async () => {
  //   const connection = {
  //     isBlankConnection: () => false,
  //     iModelId: mockIModelId,
  //     close: jest.fn(),
  //   };
  //   jest
  //     .spyOn(IModelServices, "openRemoteIModel")
  //     .mockResolvedValue(connection as any);

  //   act(() =>
  //     root.render(
  //       <IModelLoader iTwinId={mockITwinId} iModelId={mockIModelId} />
  //     )
  //   );

  //   act(() =>
  //     root.render(
  //       <IModelLoader iTwinId={mockITwinId + "1"} iModelId={mockIModelId} />
  //     )
  //   );

  //   expect(connection.close).toHaveBeenCalled();
  // });

  //   it("renders a custom loading component", async () => {
  //     const root = createRoot(container!);
  //     jest.spyOn(IModelServices, "openRemoteIModel").mockImplementation(
  //       () =>
  //         new Promise((resolve) =>
  //           setTimeout(
  //             () =>
  //               resolve({
  //                 isBlankConnection: () => false,
  //                 iModelId: mockIModelId,
  //                 close: jest.fn(),
  //                 isOpen: true,
  //               } as any),
  //             500
  //           )
  //         )
  //     );

  //     const Loader = () => {
  //       return <div id="loadingComponent">Things are happening</div>;
  //     };

  //     act(() =>
  //       root.render(
  //         <IModelLoader
  //           iTwinId={mockITwinId}
  //           iModelId={mockIModelId}
  //           loadingComponent={<Loader />}
  //         />
  //       )
  //     );

  //     const loadingComponent = document.getElementById("loadingComponent");

  //     expect(loadingComponent).toBeInTheDocument();

  //     act(() => {
  //       root.unmount();
  //     });
  //   });
});
