/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// import "@testing-library/jest-dom/extend-expect";

// import {
//   IModelReadRpcInterface,
//   IModelTileRpcInterface,
//   IModelWriteRpcInterface,
//   SnapshotIModelRpcInterface,
// } from "@bentley/imodeljs-common";
// import { WebViewerApp } from "@bentley/imodeljs-frontend";
// import { I18N } from "@bentley/imodeljs-i18n";
// import { PresentationRpcInterface } from "@bentley/presentation-common";
// import { act, render, waitFor } from "@testing-library/react";
// import React from "react";
// import { Viewer } from "../../components/Viewer";
// import { BrowserAuthorizationClientConfiguration } from "@bentley/frontend-authorization-client";
// import { BaseInitializer } from "@itwin/viewer-react";

// jest.mock("@bentley/imodeljs-i18n");
// jest.mock("@microsoft/applicationinsights-react-js", () => ({
//   ReactPlugin: jest.fn(),
//   withAITracking: (
//     reactPlugin: any | undefined, // eslint-disable-line no-unused-vars
//     component: any,
//     componentName?: string, // eslint-disable-line no-unused-vars
//     className?: string // eslint-disable-line no-unused-vars
//   ) => component,
// }));

// jest.mock("@bentley/imodeljs-frontend", () => {
//   return {
//     IModelApp: {
//       startup: jest.fn(),
//       extensionAdmin: {
//         addExtensionLoaderFront: jest.fn(),
//         loadExtension: jest.fn().mockResolvedValue(true),
//       },
//       telemetry: {
//         addClient: jest.fn(),
//       },
//       i18n: {
//         registerNamespace: jest.fn().mockReturnValue({
//           readFinished: jest.fn().mockResolvedValue(true),
//         }),
//         languageList: jest.fn().mockReturnValue(["en-US"]),
//       },
//       uiAdmin: {
//         updateFeatureFlags: jest.fn(),
//       },
//     },
//     SnapMode: {},
//     ActivityMessageDetails: jest.fn(),
//     PrimitiveTool: jest.fn(),
//     NotificationManager: jest.fn(),
//     ExternalServerExtensionLoader: jest.fn(),
//     Tool: jest.fn(),
//     RemoteBriefcaseConnection: {
//       open: jest.fn(),
//     },
//     SnapshotConnection: {
//       openFile: jest.fn(),
//     },
//     ItemField: {},
//     CompassMode: {},
//     RotationMode: {},
//     AccuDraw: class {},
//     ToolAdmin: class {},
//     WebViewerApp: {
//       startup: jest.fn().mockResolvedValue(true),
//     },
//   };
// });

// const mockProjectId = "123";
// const mockIModelId = "456";

// const authConfig: BrowserAuthorizationClientConfiguration = {
//   clientId: "test-client",
//   scope: "test-scope",
//   responseType: "code",
//   redirectUri: "http://localhost",
// };

describe("Viewer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("runs a test", () => {
    expect(true).toBeTruthy();
  });
  //TODO
  // it("overrides the i18n url template", async () => {
  //   const i18nUrlTemplate = "host/route";

  //   const { getByTestId } = render(
  //     <Viewer
  //       authConfig={{ config: authConfig }}
  //       contextId={mockProjectId}
  //       iModelId={mockIModelId}
  //       i18nUrlTemplate={i18nUrlTemplate}
  //     />
  //   );

  //   await waitFor(() => getByTestId("loader-wrapper"));

  //   expect(I18N).toHaveBeenCalledWith("iModelJs", {
  //     urlTemplate: i18nUrlTemplate,
  //   });
  // });

  // it("registers additional rpc interfaces", async () => {

  //   const { getByTestId } = render(
  //     <Viewer
  //       authConfig={{ config: authConfig }}
  //       contextId={mockProjectId}
  //       iModelId={mockIModelId}
  //       additionalRpcInterfaces={[IModelWriteRpcInterface]}
  //     />
  //   );

  //   await waitFor(() => getByTestId("loader-wrapper"));

  //   expect(WebViewerApp.startup).toHaveBeenCalledWith({
  //     webViewerApp: {
  //       rpcParams: {
  //         info: {
  //           title: "general-purpose-imodeljs-backend",
  //           version: "v2.0",
  //         },
  //         uriPrefix: "https://api.bentley.com/imodeljs",
  //       },
  //     },
  //     iModelApp: {
  //       applicationId: "3098",
  //       authorizationClient: expect.anything(),
  //       i18n: expect.anything(),
  //       notifications: expect.anything(),
  //       rpcInterfaces: [
  //         IModelReadRpcInterface,
  //         IModelTileRpcInterface,
  //         PresentationRpcInterface,
  //         SnapshotIModelRpcInterface,
  //         IModelWriteRpcInterface,
  //       ],
  //       uiAdmin: expect.anything(),
  //     },
  //   });
  // });

  // it("registers optional toolAdmin", async () => {
  // });
});
