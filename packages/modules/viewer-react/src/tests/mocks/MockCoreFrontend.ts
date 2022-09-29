/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
export const MockCoreFrontend = {
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
      onSelectionSetChanged: jest.fn(),
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
    create: jest.fn().mockImplementation((params) => ({
      isBlankConnection: () => true,
      isOpen: true,
      ...params,
    })),
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
