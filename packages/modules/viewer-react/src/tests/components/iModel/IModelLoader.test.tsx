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
  CheckpointConnection,
  IModelApp,
} from "@bentley/imodeljs-frontend";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import { BackstageItemUtilities, UiItemsManager } from "@bentley/ui-abstract";
import {
  ColorTheme,
  FrontstageProps,
  FrontstageProvider,
  UiFramework,
} from "@bentley/ui-framework";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import IModelLoader from "../../../components/iModel/IModelLoader";
import * as IModelServices from "../../../services/iModel/IModelService";
import { createBlankViewState } from "../../../services/iModel/ViewCreatorBlank";
import {
  BlankConnectionViewState,
  ViewerBackstageItem,
  ViewerFrontstage,
} from "../../../types";
import { TestUiProvider, TestUiProvider2 } from "../../mocks/MockUiProviders";

jest.mock("@bentley/ui-framework");
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
      create: jest.fn().mockReturnValue({}),
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
    jest
      .spyOn(IModelServices, "openRemoteImodel")
      .mockResolvedValue({} as CheckpointConnection);
    jest
      .spyOn(UrlDiscoveryClient.prototype, "discoverUrl")
      .mockResolvedValue("https://test.com");
    jest.spyOn(Config.App, "get").mockReturnValue(1);
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

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(BlankConnection.create).toHaveBeenCalledWith(blankConnection);
    expect(createBlankViewState).toHaveBeenCalledWith({}, viewStateOptions);
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

    expect(UiItemsManager.register).toHaveBeenCalledTimes(1);

    result.rerender(
      <IModelLoader
        contextId={mockContextId}
        iModelId={mockIModelId}
        uiProviders={[new TestUiProvider2()]}
      />
    );

    await waitFor(() => result.getByTestId("loader-wrapper"));

    expect(UiItemsManager.unregister).toHaveBeenCalledTimes(1);
  });
});
