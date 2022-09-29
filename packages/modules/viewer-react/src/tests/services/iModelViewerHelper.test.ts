/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Cartographic } from "@itwin/core-common";
import type { BlankConnectionProps } from "@itwin/core-frontend";
import { Range3d } from "@itwin/core-geometry";

import * as iModelService from "../../services/iModel/IModelService";
import {
  createBlankConnection,
  getConnectionType,
  openConnection,
} from "../../services/iModel/iModelViewerHelper";
import type { RequiredViewerConnectionProps } from "../../types";
import { ConnectionType } from "../../types";
import { MockCoreFrontend } from "../mocks/MockCoreFrontend";

jest.mock("@itwin/core-frontend", () => {
  return MockCoreFrontend;
});

describe("iModelViewerHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("getConnectionType() returns a ConnectionType depending on ViewerProps", () => {
    const localProps: RequiredViewerConnectionProps = {
      filePath: "s:/twin",
    };

    expect(getConnectionType(localProps)).toBe(ConnectionType.Local);

    const remoteProps: RequiredViewerConnectionProps = {
      iModelId: "mockIModelId",
      iTwinId: "mockITwinId",
    };

    expect(getConnectionType(remoteProps)).toBe(ConnectionType.Remote);

    const blankConnectionPropsExtents: RequiredViewerConnectionProps = {
      iTwinId: "mockITwinId",
      extents: new Range3d(),
      location: Cartographic.createZero(),
    };

    expect(getConnectionType(blankConnectionPropsExtents)).toBe(
      ConnectionType.Blank
    );

    const blankConnectionProps: RequiredViewerConnectionProps = {
      iTwinId: "mockITwinId",
      blankConnection: {
        name: "Blank Connection",
        extents: new Range3d(),
        location: Cartographic.createZero(),
      },
    };

    expect(getConnectionType(blankConnectionProps)).toBe(ConnectionType.Blank);
  });

  it.each([
    {},
    { iModelId: "imodelId" },
    { iTwinId: "iTwinId" },
    {
      extents: new Range3d(),
      location: Cartographic.createZero(),
    },
    {
      iTwinId: "iTwinId",
      location: Cartographic.createZero(),
    },
    {
      iTwinId: "iTwinId",
      extents: new Range3d(),
    },
    {
      blankConnection: {
        name: "Blank Connection",
        extents: new Range3d(),
        location: Cartographic.createZero(),
      },
    },
  ])(
    "getConnectionType() returns a ConnectionType.None for invalid props - %p",
    (props: RequiredViewerConnectionProps) => {
      expect(getConnectionType(props)).toBe(ConnectionType.None);
    }
  );

  it("openConnection() opens connection depending on ConnectionType", async () => {
    const openRemoteSpy = jest
      .spyOn(iModelService, "openRemoteIModel")
      .mockResolvedValueOnce(undefined);

    await openConnection(ConnectionType.Remote, {
      iTwinId: "iTwinId",
      iModelId: "iModelId",
    });

    expect(openRemoteSpy).toHaveBeenCalledTimes(1);

    const openLocalSpy = jest
      .spyOn(iModelService, "openLocalIModel")
      .mockResolvedValueOnce({} as any);

    await openConnection(ConnectionType.Local, {
      iTwinId: "iTwinId",
      iModelId: "iModelId",
    });

    expect(openLocalSpy).toHaveBeenCalledTimes(1);

    await openConnection(ConnectionType.Blank, {
      iTwinId: "iTwinId",
      iModelId: "iModelId",
    });

    expect(MockCoreFrontend.BlankConnection.create).toHaveBeenCalledTimes(1);
  });
});
