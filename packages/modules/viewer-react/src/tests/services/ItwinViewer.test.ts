/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  IModelWriteRpcInterface,
  SnapshotIModelRpcInterface,
} from "@bentley/imodeljs-common";
import {
  ExternalServerExtensionLoader,
  IModelApp,
  WebViewerApp,
} from "@bentley/imodeljs-frontend";
import { I18N } from "@bentley/imodeljs-i18n";
import { PresentationRpcInterface } from "@bentley/presentation-common";
import React from "react";
import ReactDOM from "react-dom";

import IModelLoader from "../../components/iModel/IModelLoader";
import AuthorizationClient from "../../services/auth/AuthorizationClient";
import Initializer from "../../services/Initializer";
import { ItwinViewer } from "../../services/ItwinViewer";
import { ai } from "../../services/telemetry/TelemetryService";
import {
  IModelBackend,
  IModelBackendHost,
  IModelBackendOptions,
} from "../../types";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient";
import MockOidcClient from "../mocks/MockOidcClient";

jest.mock("@bentley/imodeljs-i18n");
jest.mock("../../services/auth/AuthorizationClient");
jest.mock("@microsoft/applicationinsights-react-js", () => ({
  ReactPlugin: jest.fn(),
  withAITracking: (
    reactPlugin: any | undefined, // eslint-disable-line no-unused-vars
    component: any,
    componentName?: string, // eslint-disable-line no-unused-vars
    className?: string // eslint-disable-line no-unused-vars
  ) => component,
}));
jest.mock("@bentley/ui-framework");
jest.mock("@bentley/presentation-frontend");
jest.mock("@bentley/imodeljs-frontend", () => {
  return {
    IModelApp: {
      startup: jest.fn().mockResolvedValue(true),
      extensionAdmin: {
        addExtensionLoaderFront: jest.fn(),
        loadExtension: jest.fn().mockResolvedValue(true),
      },
      telemetry: {
        addClient: jest.fn(),
      },
      i18n: {
        registerNamespace: jest.fn().mockReturnValue({
          readFinished: jest.fn().mockResolvedValue(true),
        }),
        languageList: jest.fn().mockReturnValue(["en-US"]),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
    },
    SnapMode: {},
    ActivityMessageDetails: jest.fn(),
    PrimitiveTool: jest.fn(),
    NotificationManager: jest.fn(),
    ExternalServerExtensionLoader: jest.fn(),
    Tool: jest.fn(),
    SnapshotConnection: {
      openFile: jest.fn(),
    },
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class {},
    ToolAdmin: class {},
    WebViewerApp: {
      startup: jest.fn().mockResolvedValue(true),
    },
  };
});
jest.mock("../../services/telemetry/TelemetryService");
jest.mock("../../services/iModel/IModelService");
jest.mock("@bentley/property-grid-react");

const elementId = "viewerRoot";
const mockProjectId = "mockProjectId";
const mockiModelId = "mockImodelId";

describe("iTwinViewer", () => {
  beforeAll(() => {
    const viewerRoot = document.createElement("div");
    viewerRoot.id = elementId;
    document.body.append(viewerRoot);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    MockAuthorizationClient.initialize().catch((error) => console.error(error));
  });

  it("throws and error when an either an oidc client or user manager is not provided", () => {
    let errorMessage;
    try {
      new ItwinViewer({ elementId, authConfig: {} });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual(
      "Please supply an OIDC client or a function to get your client's user manager"
    ); //TODO localize
  });

  it("initializes iModel.js with the passed in oidc client", async () => {
    jest.spyOn(Initializer, "initialize");
    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
    });
    await Initializer.initialized;
    expect(Initializer.initialize).toHaveBeenCalledWith(
      {
        authorizationClient: MockAuthorizationClient.oidcClient,
      },
      { appInsightsKey: undefined, backend: undefined, productId: undefined }
    );
  });

  it("creates a new AuthorizationClient using the passed oidc user manager", () => {
    const oidcClient = new MockOidcClient();
    new ItwinViewer({
      elementId,
      authConfig: {
        getUserManagerFunction: oidcClient.getUserManager,
      },
    });
    expect(AuthorizationClient).toHaveBeenCalledWith(oidcClient.getUserManager);
  });

  it("renders the viewer for the proper contextId and iModelId on the element whose id is passed to the constructor", async () => {
    jest.spyOn(React, "createElement");
    jest.spyOn(ReactDOM, "render");

    const viewer = new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
    });
    await viewer.load({ contextId: mockProjectId, iModelId: mockiModelId });
    expect(React.createElement).toHaveBeenCalledWith(IModelLoader, {
      contextId: mockProjectId,
      iModelId: mockiModelId,
      changeSetId: undefined,
    });
    expect(ReactDOM.render).toHaveBeenCalledWith(
      expect.anything(),
      document.getElementById(elementId)
    );
  });

  it("initializes iModel.js with the passed in backend configuration", () => {
    const backendConfig: IModelBackendOptions = {
      hostedBackend: {
        title: IModelBackend.GeneralPurpose,
        version: "v2.0",
        hostType: IModelBackendHost.K8S,
      },
    };

    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      backend: backendConfig,
    });

    expect(Initializer.initialize).toHaveBeenCalledWith(
      {
        authorizationClient: MockAuthorizationClient.oidcClient,
      },
      {
        appInsightsKey: undefined,
        backend: backendConfig,
        productId: undefined,
      }
    );
  });

  it("queries the iModel with the provided changeSetId", async () => {
    const changeSetId = "123";

    const viewer = new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
    });

    await viewer.load({
      contextId: mockProjectId,
      iModelId: mockiModelId,
      changeSetId,
    });

    expect(React.createElement).toHaveBeenCalledWith(IModelLoader, {
      contextId: mockProjectId,
      iModelId: mockiModelId,
      changeSetId: changeSetId,
    });
  });

  it("loads the extension with the passed in version and args", async () => {
    const viewer = new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
    });

    await viewer.addExtension(
      "SampleExtension",
      "2",
      "http://extensionhome.com",
      ["one", "two"]
    );

    await Initializer.initialized;

    expect(
      IModelApp.extensionAdmin.addExtensionLoaderFront
    ).toHaveBeenCalledWith(
      new ExternalServerExtensionLoader("http://extensionhome.com")
    );

    expect(
      IModelApp.extensionAdmin.loadExtension
    ).toHaveBeenCalledWith("SampleExtension", "2", ["one", "two"]);
  });

  it("instantiates an instance of the Telemetry Service when an app insights key is provided", async () => {
    const appInsightsKey = "123";

    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      appInsightsKey,
    });

    await Initializer.initialized;

    expect(ai.initialize).toHaveBeenCalledWith(appInsightsKey);
  });

  it("does not instantiate an instance of the Telemetry Service when an app insights key is not provided", async () => {
    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
    });

    await Initializer.initialized;

    expect(ai.initialize).not.toHaveBeenCalledWith();
  });

  it("adds the iModel.js telemetry client when the imjs key is provided", async () => {
    const appInsightsKey = "123";
    const imjsAppInsightsKey = "456";

    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      appInsightsKey,
      imjsAppInsightsKey,
    });
    await Initializer.initialized;

    expect(IModelApp.telemetry.addClient).toHaveBeenCalledTimes(2);
  });

  it("does not add the iModel.js telemetry client when the imjs key is not provided", async () => {
    const appInsightsKey = "123";

    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      appInsightsKey,
    });
    await Initializer.initialized;

    expect(IModelApp.telemetry.addClient).toHaveBeenCalledTimes(1);
  });

  it("overrides the i18n url template", async () => {
    const i18nUrlTemplate = "host/route";

    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      i18nUrlTemplate,
    });

    await Initializer.initialized;

    expect(I18N).toHaveBeenCalledWith("iModelJs", {
      urlTemplate: i18nUrlTemplate,
    });
  });

  it("ensures that either a contextId/iModelId combination or a local snapshot is provided", async () => {
    const viewer = new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
    });

    let error;
    try {
      await viewer.load({});
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(
      new Error(
        "Please provide a valid contextId and iModelId or a local snapshotPath"
      )
    );
  });

  it("renders if a local snapshot is provided", async () => {
    jest.spyOn(ReactDOM, "render");

    const snapshotPath = "/path/to/snapshot";

    const viewer = new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
    });

    await viewer.load({ snapshotPath });

    expect(ReactDOM.render).toHaveBeenCalledWith(
      expect.anything(),
      document.getElementById(elementId)
    );
  });

  it("executes a callback after IModelApp is initialized", async () => {
    const callbacks = {
      onIModelAppInit: jest.fn(),
    };

    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      onIModelAppInit: callbacks.onIModelAppInit,
    });

    await Initializer.initialized;

    expect(callbacks.onIModelAppInit).toHaveBeenCalled();
  });

  it("registers additional i18n namespaces", async () => {
    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      additionalI18nNamespaces: ["test1", "test2"],
    });

    await Initializer.initialized;

    expect(IModelApp.i18n.registerNamespace).toHaveBeenCalledWith("test1");
    expect(IModelApp.i18n.registerNamespace).toHaveBeenCalledWith("test2");
  });

  it("registers additional rpc interfaces", async () => {
    new ItwinViewer({
      elementId,
      authConfig: {
        oidcClient: MockAuthorizationClient.oidcClient,
      },
      additionalRpcInterfaces: [IModelWriteRpcInterface],
    });

    await Initializer.initialized;

    expect(WebViewerApp.startup).toHaveBeenCalledWith({
      webViewerApp: {
        rpcParams: {
          info: {
            title: "general-purpose-imodeljs-backend",
            version: "v2.0",
          },
          uriPrefix: "https://api.bentley.com/imodeljs",
        },
      },
      iModelApp: {
        applicationId: "3098",
        authorizationClient: expect.anything(),
        i18n: expect.anything(),
        notifications: expect.anything(),
        rpcInterfaces: [
          IModelReadRpcInterface,
          IModelTileRpcInterface,
          PresentationRpcInterface,
          SnapshotIModelRpcInterface,
          IModelWriteRpcInterface,
        ],
        uiAdmin: expect.anything(),
      },
    });
  });
});
