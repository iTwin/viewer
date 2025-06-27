/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Cartographic } from "@itwin/core-common";
import type { BlankConnectionProps } from "@itwin/core-frontend";
import { BlankConnection } from "@itwin/core-frontend";
import { Range3d } from "@itwin/core-geometry";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as iModelService from "../../services/iModel/IModelService.js";
import {
  createBlankConnection,
  gatherRequiredViewerProps,
  openConnection,
} from "../../services/iModel/iModelViewerHelper.js";

vi.mock("@itwin/core-frontend", () => {
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
        onSelectionSetChanged: vi.fn(),
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
      create: vi.fn().mockImplementation((params) => ({
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

describe("iModelViewerHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createBlankConnection() with separate iTwinId", async () => {
    const mockITwinId = "mockITwinId";
    const blankConnectionProps: BlankConnectionProps = {
      name: "Blank Connection",
      extents: new Range3d(10, 10, 10),
      location: Cartographic.createZero(),
    };
    const blankConnection = createBlankConnection({
      iTwinId: mockITwinId,
      blankConnectionProps,
    });

    expect(blankConnection.iTwinId).toEqual(mockITwinId);
  });

  it("createBlankConnection() with iTwinId passed in connection props", () => {
    const mockITwinId = "mockITwinId";
    const blankConnectionProps: BlankConnectionProps = {
      name: "Blank Connection",
      extents: new Range3d(10, 10, 10),
      location: Cartographic.createZero(),
      iTwinId: mockITwinId,
    };
    const blankConnection = createBlankConnection({
      iTwinId: mockITwinId,
      blankConnectionProps,
    });

    expect(blankConnection.iTwinId).toEqual(mockITwinId);
  });

  it("openConnection() opens a connection type depending on parameters", async () => {
    const openRemoteSpy = vi
      .spyOn(iModelService, "openRemoteIModel")
      .mockResolvedValueOnce(undefined);

    await openConnection({
      iTwinId: "iTwinId",
      iModelId: "iModelId",
    });

    expect(openRemoteSpy).toHaveBeenCalledTimes(1);

    const openLocalSpy = vi
      .spyOn(iModelService, "openLocalIModel")
      .mockResolvedValueOnce({} as any);

    await openConnection({
      filePath: "x:/my/imodel",
    });

    expect(openLocalSpy).toHaveBeenCalledTimes(1);

    await openConnection({
      extents: new Range3d(10, 10, 10),
      location: Cartographic.createZero(),
      iTwinId: "iTwinId",
    });

    expect(BlankConnection.create).toHaveBeenCalledTimes(1);
  });

  it("gatherRequiredViewerProps narrows required viewer properties", async () => {
    const validConnectedProps = { iTwinId: "iTwinId", iModelId: "iModelId" };
    const validBlankConnectionProps = {
      extents: new Range3d(10, 10, 10),
      location: Cartographic.createZero(),
      iTwinId: "mockITwinId",
    };
    const validLocalConnectionProps = { filePath: "x:\\imodel" };

    expect(gatherRequiredViewerProps(validConnectedProps)).toEqual(
      validConnectedProps
    );
    expect(gatherRequiredViewerProps(validBlankConnectionProps)).toEqual(
      validBlankConnectionProps
    );
    expect(gatherRequiredViewerProps(validLocalConnectionProps)).toEqual(
      validLocalConnectionProps
    );
    expect(gatherRequiredViewerProps({})).toBeUndefined();
    expect(
      gatherRequiredViewerProps({ iTwinId: "mockItwinId" })
    ).toBeUndefined();
    expect(gatherRequiredViewerProps({ iModelId: "iModelId" })).toBeUndefined();
  });
});
