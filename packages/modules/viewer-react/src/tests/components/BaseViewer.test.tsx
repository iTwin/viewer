/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import "@testing-library/jest-dom/extend-expect";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule("@itwin/core-frontend", async () => {
  return {
    IModelApp: {
      initialized: true,
      startup: jest.fn(),
      telemetry: {
        addClient: jest.fn(),
      },
      localization: {
        registerNamespace: jest.fn().mockResolvedValue(true),
        getLanguageList: jest.fn().mockReturnValue(["en-US"]),
        getLocalizedString: jest.fn(),
        unregisterNamespace: jest.fn(),
        translateWithNamespace: jest.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
      authorizationClient: {
        onAccessTokenChanged: {
          addListener: jest.fn(),
        },
      },
      viewManager: {
        onViewOpen: {
          addOnce: jest.fn(),
        },
      },
      shutdown: jest.fn().mockImplementation(() => Promise.resolve()),
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
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class { },
    ToolAdmin: class { },
    BriefcaseConnection: {
      openFile: jest.fn(),
    },
    ScreenViewport: class { },
    getQuantityTypeKey: jest.fn(),
    isCheckboxFormatPropEditorSpec: jest.fn(),
    isCustomQuantityTypeDefinition: jest.fn(),
    isTextInputFormatPropEditorSpec: jest.fn(),
    isTextSelectFormatPropEditorSpec: jest.fn(),
    StandardView: class { },
    ToolSettings: class { },
    DrawingViewState: class { },
    OrthographicViewState: class { },
    SheetViewState: class { },
    SpatialViewState: class { },
    StandardViewId: { }
  };
});

import { UiCore } from "@itwin/core-react";
// import { render, waitFor } from "@testing-library/react";
// import React from "react";

// jest.mock("../../services/iModel/IModelService");
// jest.mock("@itwin/appui-react", () => {
//   return {
//     ...jest.createMockFromModule<any>("@itwin/appui-react"),
//     UiFramework: {
//       ...jest.createMockFromModule<any>("@itwin/appui-react").UiFramework,
//       initialize: jest.fn().mockImplementation(() => Promise.resolve()),
//     },
//     UiItemsManager: {
//       ...jest.createMockFromModule<any>("@itwin/appui-react").UiItemsManager,
//       getBackstageItems: jest.fn().mockReturnValue([]),
//     },
//   };
// });
// jest.unstable_mockModule("@itwin/presentation-frontend", () => {
//   return {
//     Presentation: {
//       initialize: jest.fn().mockImplementation(() => Promise.resolve()),
//       selection: {
//         scopes: {
//           getSelectionScopes: jest.fn(async () => []),
//         },
//       },
//     },
//   };
// });

// jest.mock("../../services/BaseInitializer", () => {
//   return {
//     BaseInitializer: {
//       authClient: {
//         hasSignedIn: true,
//         isAuthorized: true,
//         onAccessTokenChanged: {
//           addListener: jest.fn(),
//         },
//       },
//       initialize: jest.fn().mockResolvedValue(true),
//       cancel: jest.fn(),
//       shutdown: jest.fn(),
//       initialized: Promise.resolve(),
//     },
//   };
// });
// jest.mock("../../hooks/useAccessToken", () => {
//   return { useAccessToken: () => "mockToken" };
// });

const mockITwinId = "123";
const mockIModelId = "456";

describe("BaseViewer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (UiCore.initialized) { // eslint-disable-line @typescript-eslint/no-deprecated
      UiCore.terminate(); // eslint-disable-line @typescript-eslint/no-deprecated
    }
  });

  it("loads the model loader for the specified iTwinId and iModelId", async () => {
    const { BaseViewer } = await import("../..");
    const { getByTestId } = render(
      <BaseViewer
        iTwinId={mockITwinId}
        iModelId={mockIModelId}
        enablePerformanceMonitors={false}
      />
    );

    const viewerContainer = await waitFor(() => getByTestId("loader-wrapper"));

    expect(viewerContainer).toBeDefined();
  });

  // it("queries the iModel with the provided changeSetId", async () => {
  //   const { getByTestId } = render(
  //     <BaseViewer
  //       iTwinId={mockITwinId}
  //       iModelId={mockIModelId}
  //       productId={"0000"}
  //       changeSetId={"123"}
  //       enablePerformanceMonitors={false}
  //     />
  //   );

  //   await waitFor(() => getByTestId("loader-wrapper"));

  //   expect(IModelService.openRemoteIModel).toHaveBeenCalledWith(
  //     mockITwinId,
  //     mockIModelId,
  //     "123"
  //   );
  // });

  // it("renders and attempts to create a briefcase connection or snapshot connection if a local path is provided", async () => {
  //   const fileName = "/path/to/snapshot";

  //   const { getByTestId } = render(
  //     <BaseViewer filePath={fileName} enablePerformanceMonitors={false} />
  //   );

  //   const loader = await waitFor(() => getByTestId("loader-wrapper"));

  //   expect(loader).toBeInTheDocument();
  //   expect(IModelService.openLocalIModel).toHaveBeenCalledWith(
  //     fileName,
  //     undefined
  //   );
  // });

  // it("renders and attempts to create a briefcase connection in write mode", async () => {
  //   const fileName = "/path/to/snapshot";

  //   const { getByTestId } = render(
  //     <BaseViewer
  //       filePath={fileName}
  //       readonly={false}
  //       enablePerformanceMonitors={false}
  //     />
  //   );

  //   const loader = await waitFor(() => getByTestId("loader-wrapper"));

  //   expect(loader).toBeInTheDocument();
  //   expect(IModelService.openLocalIModel).toHaveBeenCalledWith(fileName, false);
  // });
});
