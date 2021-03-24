/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "@testing-library/jest-dom/extend-expect";

import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  IModelWriteRpcInterface,
  SnapshotIModelRpcInterface,
} from "@bentley/imodeljs-common";
import {
  IModelApp,
  SnapshotConnection,
  WebViewerApp,
} from "@bentley/imodeljs-frontend";
import { I18N } from "@bentley/imodeljs-i18n";
import { PresentationRpcInterface } from "@bentley/presentation-common";
import { render, waitFor } from "@testing-library/react";
import React from "react";

import { Viewer } from "../..";
import * as IModelService from "../../services/iModel/IModelService";
import Initializer from "../../services/Initializer";
import { ai } from "../../services/telemetry/TelemetryService";
import {
  IModelBackend,
  IModelBackendHost,
  IModelBackendOptions,
} from "../../types";
import MockOidcClient from "../mocks/MockOidcClient";

jest.mock("@bentley/imodeljs-i18n");
jest.mock("../../services/auth/AuthorizationClient");
jest.mock("../../services/iModel/IModelService");
jest.mock("@bentley/ui-framework");
jest.mock("@bentley/presentation-frontend");

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
    RemoteBriefcaseConnection: {
      open: jest.fn(),
    },
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
jest.mock("@bentley/property-grid-react");

const mockProjectId = "123";
const mockIModelId = "456";
const oidcClient = new MockOidcClient();

describe("Viewer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads the model loader for the specified contextId and iModelId", async () => {
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
      />
    );

    const viewerContainer = await waitFor(() => getByTestId("loader-wrapper"));

    expect(viewerContainer).toBeInTheDocument();
  });

  it("initializes the viewer with the provided backend configuration", async () => {
    jest.spyOn(Initializer, "initialize");

    const backendConfig: IModelBackendOptions = {
      hostedBackend: {
        title: IModelBackend.GeneralPurpose,
        version: "v2.0",
        hostType: IModelBackendHost.K8S,
      },
    };

    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        backend={backendConfig}
        productId={"0000"}
      />
    );

    const viewerContainer = await waitFor(() => getByTestId("loader-wrapper"));

    expect(viewerContainer).toBeInTheDocument();

    expect(Initializer.initialize).toHaveBeenCalledWith(
      { authorizationClient: {} },
      {
        appInsightsKey: undefined,
        backend: backendConfig,
        imjsAppInsightsKey: undefined,
        productId: "0000",
      }
    );
  });

  it("queries the iModel with the provided changeSetId", async () => {
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        productId={"0000"}
        changeSetId={"123"}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(IModelService.openRemoteImodel).toHaveBeenCalledWith(
      mockProjectId,
      mockIModelId,
      "123"
    );
  });

  it("instantiates an instance of the Telemetry Service when an app insights key is provided", async () => {
    const appInsightsKey = "123";
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        appInsightsKey={appInsightsKey}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(ai.initialize).toHaveBeenCalledWith(appInsightsKey);
  });

  it("does not instantiate an instance of the Telemetry Service when an app insights key is not provided", async () => {
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(ai.initialize).not.toHaveBeenCalled();
  });

  it("adds the iModel.js telemetry client when the imjs key is provided", async () => {
    const appInsightsKey = "123";
    const imjsAppInsightsKey = "456";
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        appInsightsKey={appInsightsKey}
        imjsAppInsightsKey={imjsAppInsightsKey}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(IModelApp.telemetry.addClient).toHaveBeenCalledTimes(2);
  });

  it("does not add the iModel.js telemetry client when the imjs key is not provided", async () => {
    const appInsightsKey = "123";
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        appInsightsKey={appInsightsKey}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(IModelApp.telemetry.addClient).toHaveBeenCalledTimes(1);
  });

  it("overrides the i18n url template", async () => {
    const i18nUrlTemplate = "host/route";

    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        i18nUrlTemplate={i18nUrlTemplate}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(I18N).toHaveBeenCalledWith("iModelJs", {
      urlTemplate: i18nUrlTemplate,
    });
  });

  it("ensures that either a contextId/iModelId combination or a local snapshot is provided", async () => {
    const events = {
      onError: (event: ErrorEvent) => {
        event.preventDefault();
      },
    };

    jest.spyOn(events, "onError");

    window.addEventListener("error", events.onError);

    const { getByTestId } = render(
      <Viewer
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
      />
    );

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).not.toBeInTheDocument();
    expect(events.onError).toHaveBeenCalled();

    window.removeEventListener("error", events.onError);
  });

  it("renders and establishes a SnapshotConnection if a local snapshot is provided", async () => {
    const snapshotPath = "/path/to/snapshot";

    const { getByTestId } = render(
      <Viewer
        snapshotPath={snapshotPath}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
      />
    );

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).toBeInTheDocument();
    expect(SnapshotConnection.openFile).toHaveBeenCalledWith(snapshotPath);
  });

  it("executes a callback after IModelApp is initialized", async () => {
    const snapshotPath = "/path/to/snapshot";
    const callbacks = {
      onIModelAppInit: jest.fn(),
    };
    const { getByTestId } = render(
      <Viewer
        snapshotPath={snapshotPath}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        onIModelAppInit={callbacks.onIModelAppInit}
      />
    );

    const loader = await waitFor(() => getByTestId("loader-wrapper"));

    expect(loader).toBeInTheDocument();
    expect(callbacks.onIModelAppInit).toHaveBeenCalled();
  });

  it("registers additional i18n namespaces", async () => {
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        additionalI18nNamespaces={["test1", "test2"]}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

    expect(IModelApp.i18n.registerNamespace).toHaveBeenCalledWith("test1");
    expect(IModelApp.i18n.registerNamespace).toHaveBeenCalledWith("test2");
  });

  it("registers additional rpc interfaces", async () => {
    const { getByTestId } = render(
      <Viewer
        contextId={mockProjectId}
        iModelId={mockIModelId}
        authConfig={{ getUserManagerFunction: oidcClient.getUserManager }}
        additionalRpcInterfaces={[IModelWriteRpcInterface]}
      />
    );

    await waitFor(() => getByTestId("loader-wrapper"));

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
