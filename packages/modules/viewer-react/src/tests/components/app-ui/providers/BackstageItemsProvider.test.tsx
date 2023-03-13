/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StandardContentLayouts } from "@itwin/appui-abstract";
import type { FrontstageConfig } from "@itwin/appui-react";
import { ContentGroup, IModelViewportControl } from "@itwin/appui-react";
import { BackstageItemUtilities, FrontstageProvider } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";
import React from "react";

import { BackstageItemsProvider } from "../../../../components/app-ui/providers";
import type { ViewerBackstageItem, ViewerFrontstage } from "../../../../types";

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
jest.mock("@itwin/appui-abstract");

class Frontstage1Provider extends FrontstageProvider {
  frontstageConfig(): FrontstageConfig {
    const content = new ContentGroup({
      id: "content-group",
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "viewport",
          classId: IModelViewportControl,
        },
      ],
    });
    return { id: "Frontstage1", contentGroup: content, version: 1 };
  }
  public id = "Frontstage1";
  // public get frontstage(): React.ReactElement<FrontstageProps> {
  //   return <div></div>;
  // }
}

class Frontstage2Provider extends FrontstageProvider {
  frontstageConfig(): FrontstageConfig {
    const content = new ContentGroup({
      id: "content-group",
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "viewport",
          classId: IModelViewportControl,
        },
      ],
    });
    return { id: "Frontstage2", contentGroup: content, version: 1 };
  }
  public id = "Frontstage2";
}

describe("BackstageItemsProvider", () => {
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

    const spy1 = jest.spyOn(BackstageItemUtilities, "createStageLauncher");

    const spy2 = jest.spyOn(BackstageItemUtilities, "createActionItem");

    const backstageItems: ViewerBackstageItem[] = [actionItem, stageLauncher];

    const provider = new BackstageItemsProvider(backstageItems);

    provider.provideBackstageItems();

    // these calls will be doubled. items will be set first without a viewState and reset with one additional translation for the default frontstage once we have a viewState
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(IModelApp.localization.getLocalizedString).toHaveBeenCalledWith(
      actionItem.labeli18nKey
    );
    expect(IModelApp.localization.getLocalizedString).toHaveBeenCalledWith(
      stageLauncher.labeli18nKey
    );
  });
});
