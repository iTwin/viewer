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
import { IModelApp } from "@bentley/imodeljs-frontend";
import { I18N } from "@bentley/imodeljs-i18n";
import { PresentationRpcInterface } from "@bentley/presentation-common";
import { UiCore } from "@bentley/ui-core";

import {
  BaseInitializer,
  getIModelAppOptions,
} from "../../services/BaseInitializer";
import { ai } from "../../services/telemetry/TelemetryService";
import { MockToolAdmin } from "../mocks/MockToolAdmin";

jest.mock("@bentley/imodeljs-i18n");
jest.mock("@bentley/ui-framework");
jest.mock("@bentley/presentation-frontend");
jest.mock("@bentley/imodeljs-frontend", () => {
  const noMock = jest.requireActual("@bentley/imodeljs-frontend");
  return {
    IModelApp: {
      startup: jest.fn().mockResolvedValue(true),
      telemetry: {
        addClient: jest.fn(),
      },
      i18n: {
        registerNamespace: jest.fn().mockReturnValue({
          readFinished: jest.fn().mockResolvedValue(true),
        }),
        languageList: jest.fn().mockReturnValue(["en-US"]),
        unregisterNamespace: jest.fn(),
      },
      uiAdmin: {
        updateFeatureFlags: jest.fn(),
      },
    },
    SnapMode: {},
    ActivityMessageDetails: jest.fn(),
    PrimitiveTool: jest.fn(),
    NotificationManager: jest.fn(),
    Tool: jest.fn(),
    SnapshotConnection: {
      openFile: jest.fn(),
    },
    ToolAdmin: noMock.ToolAdmin,
    ItemField: {},
    CompassMode: {},
    RotationMode: {},
    AccuDraw: class {},
  };
});
jest.mock("@bentley/property-grid-react");
jest.mock("../../services/telemetry/TelemetryService");

describe("BaseInitializer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (UiCore.initialized) {
      UiCore.terminate();
    }
  });

  it("gets default iModelApp options", () => {
    const appOptions = getIModelAppOptions();
    expect(appOptions).toEqual({
      applicationId: "3098",
      notifications: expect.anything(),
      uiAdmin: expect.anything(),
      rpcInterfaces: [
        IModelReadRpcInterface,
        IModelTileRpcInterface,
        PresentationRpcInterface,
        SnapshotIModelRpcInterface,
      ],
      i18n: expect.anything(),
      toolAdmin: undefined,
    });
  });

  it("sets the applicationId", () => {
    const productId = "1234";

    const appOptions = getIModelAppOptions({
      productId: productId,
    });

    expect(appOptions.applicationId).toEqual(productId);
  });

  it("registers additional rpcInterfaces", () => {
    const additionalRpcInterfaces = [IModelWriteRpcInterface];

    const appOptions = getIModelAppOptions({
      additionalRpcInterfaces: additionalRpcInterfaces,
    });

    expect(appOptions.rpcInterfaces).toEqual([
      IModelReadRpcInterface,
      IModelTileRpcInterface,
      PresentationRpcInterface,
      SnapshotIModelRpcInterface,
      IModelWriteRpcInterface,
    ]);
  });

  it("registers a toolAdmin", () => {
    const toolAdmin = new MockToolAdmin();
    const appOptions = getIModelAppOptions({
      toolAdmin: toolAdmin,
    });

    expect(appOptions.toolAdmin).toEqual(toolAdmin);
  });

  it("overrides the i18n url template", () => {
    const i18nUrlTemplate = "host/route";

    getIModelAppOptions({
      i18nUrlTemplate: i18nUrlTemplate,
    });

    expect(I18N).toHaveBeenCalledWith("iModelJs", {
      urlTemplate: i18nUrlTemplate,
    });
  });

  it("registers additional i18n namespaces", async () => {
    await BaseInitializer.initialize({
      additionalI18nNamespaces: ["test1", "test2"],
    });

    await BaseInitializer.initialized;

    expect(IModelApp.i18n.registerNamespace).toHaveBeenCalledWith("test1");
    expect(IModelApp.i18n.registerNamespace).toHaveBeenCalledWith("test2");
  });

  it("instantiates an instance of the Telemetry Service when an app insights key is provided", async () => {
    const appInsightsKey = "123";
    await BaseInitializer.initialize({
      appInsightsKey: appInsightsKey,
    });

    await BaseInitializer.initialized;

    expect(ai.initialize).toHaveBeenCalledWith(appInsightsKey);
  });

  it("does not instantiate an instance of the Telemetry Service when an app insights key is not provided", async () => {
    await BaseInitializer.initialize();

    await BaseInitializer.initialized;

    expect(ai.initialize).not.toHaveBeenCalled();
  });
});
