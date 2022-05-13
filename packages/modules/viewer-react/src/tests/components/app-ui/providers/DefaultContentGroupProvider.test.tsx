/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { UiFramework } from "@itwin/appui-react";
import type { IModelConnection } from "@itwin/core-frontend";

import { DefaultContentGroupProvider } from "../../../../components/app-ui/providers";
import { ViewCreator3d } from "../../../../services/iModel";
import { createBlankViewState } from "../../../../services/iModel";
import type { ViewerViewportControlOptions } from "../../../../types";

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

jest.mock("../../../../services/iModel/ViewCreatorBlank", () => {
  return {
    createBlankViewState: jest.fn().mockResolvedValue({}),
  };
});

jest.mock("../../../../services/iModel/ViewCreator3d", () => {
  return {
    ViewCreator3d: jest.fn().mockImplementation(() => {
      return {
        createDefaultView: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

jest.mock("@itwin/appui-react");

const mockITwinId = "mockITwinId";
const mockIModelId = "mockIModelId";

describe("DefaultContentGroupProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("generates a default viewstate for a connection", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => false,
    } as any);

    const contentGroupProvider = new DefaultContentGroupProvider();
    await contentGroupProvider.provideContentGroup();
    expect(ViewCreator3d).toHaveBeenCalled();
  });

  it("generates a blank viewstate for a blank connection", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => true,
    } as any);

    const contentGroupProvider = new DefaultContentGroupProvider();
    await contentGroupProvider.provideContentGroup();
    expect(createBlankViewState).toHaveBeenCalled();
  });

  it("uses the provided viewstate when connection imodelid matches viewstate imodelid", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => false,
      iModelId: mockIModelId,
    } as any);

    const viewportOptions: ViewerViewportControlOptions = {
      viewState: {
        iModel: {
          iModelId: mockIModelId,
        },
      } as any,
    };
    const contentGroupProvider = new DefaultContentGroupProvider(
      viewportOptions
    );
    await contentGroupProvider.provideContentGroup();
    expect(ViewCreator3d).not.toHaveBeenCalled();
  });

  it("gets the viewstate from the provided function", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => false,
    } as any);

    const mocks = {
      viewState: (connection: IModelConnection) =>
        ({
          iModel: connection,
        } as any),
    };
    jest.spyOn(mocks, "viewState");
    const viewportOptions: ViewerViewportControlOptions = {
      viewState: mocks.viewState,
    };
    const contentGroupProvider = new DefaultContentGroupProvider(
      viewportOptions
    );
    await contentGroupProvider.provideContentGroup();
    expect(mocks.viewState).toHaveBeenCalled();
  });

  it("will not generate a default viewState when alwaysUseSuppliedViewState is true", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => false,
    } as any);

    const viewportOptions: ViewerViewportControlOptions = {
      alwaysUseSuppliedViewState: true,
    };
    const contentGroupProvider = new DefaultContentGroupProvider(
      viewportOptions
    );
    await contentGroupProvider.provideContentGroup();
    expect(ViewCreator3d).not.toHaveBeenCalled();
  });

  it("generates a default viewstate alwaysUseSuppliedViewState is false and no viewstate is provided", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => false,
    } as any);

    const viewportOptions: ViewerViewportControlOptions = {
      alwaysUseSuppliedViewState: false,
    };
    const contentGroupProvider = new DefaultContentGroupProvider(
      viewportOptions
    );
    await contentGroupProvider.provideContentGroup();
    expect(ViewCreator3d).toHaveBeenCalled();
  });

  it("generates a default viewstate when connection imodelid does not match viewstate imodelid", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => false,
      iModelId: mockIModelId,
      isOpen: true,
    } as any);

    const viewportOptions: ViewerViewportControlOptions = {
      viewState: {
        iModel: {
          iModelId: `${mockIModelId}2`,
        },
      } as any,
    };
    const contentGroupProvider = new DefaultContentGroupProvider(
      viewportOptions
    );
    await contentGroupProvider.provideContentGroup();
    expect(ViewCreator3d).toHaveBeenCalled();
  });
});
