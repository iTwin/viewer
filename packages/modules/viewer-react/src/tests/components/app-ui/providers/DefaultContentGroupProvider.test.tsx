/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { UiFramework } from "@itwin/appui-react";

import { DefaultContentGroupProvider } from "../../../../components/app-ui/providers";
import { ViewCreator3d } from "../../../../services/iModel";
import { createBlankViewState } from "../../../../services/iModel";

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

describe("DefaultContentGroupProvider", () => {
  it("creates a default ViewState for a connection", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => false,
    } as any);
    jest.spyOn(UiFramework, "setDefaultViewState").mockReturnValue();

    const contentGroupProvider = new DefaultContentGroupProvider();
    await contentGroupProvider.provideContentGroup();
    expect(ViewCreator3d).toHaveBeenCalled();
  });

  it("creates a blank ViewState for a blank connection", async () => {
    jest.spyOn(UiFramework, "getIModelConnection").mockReturnValue({
      isBlankConnection: () => true,
    } as any);
    jest.spyOn(UiFramework, "setDefaultViewState").mockReturnValue();

    const contentGroupProvider = new DefaultContentGroupProvider();
    await contentGroupProvider.provideContentGroup();
    expect(createBlankViewState).toHaveBeenCalled();
  });
});
