/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable prefer-rest-params */

import type { IModelRpcProps } from "@itwin/core-common";
import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  RpcInterface,
  RpcManager,
  SnapshotIModelRpcInterface,
} from "@itwin/core-common";
import { PresentationRpcInterface } from "@itwin/presentation-common";

export const defaultRpcInterfaces = [
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  PresentationRpcInterface,
  SnapshotIModelRpcInterface,
];

export abstract class TestRpcInterface extends RpcInterface {
  // eslint-disable-line deprecation/deprecation
  public static readonly interfaceName = "TestRpcInterface";
  public static interfaceVersion = "1.1.1";

  public static getClient(): TestRpcInterface {
    return RpcManager.getClientForInterface(TestRpcInterface);
  }
  public async restartIModelHost(): Promise<void> {
    return this.forward(arguments);
  }
  public async executeTest(
    _iModelRpcProps: IModelRpcProps,
    _testName: string,
    _params: any
  ): Promise<any> {
    return this.forward(arguments);
  }
  public async purgeCheckpoints(_iModelId: string): Promise<void> {
    return this.forward(arguments);
  }
  public async purgeStorageCache(): Promise<void> {
    return this.forward(arguments);
  }
  public async beginOfflineScope(): Promise<void> {
    return this.forward(arguments);
  }
  public async endOfflineScope(): Promise<void> {
    return this.forward(arguments);
  }
}

export class TestRpcInterface2 extends TestRpcInterface {
  public static override readonly interfaceName = "TestRpcInterface";
  public static override interfaceVersion = "1.1.1";
  public static override getClient(): TestRpcInterface2 {
    return RpcManager.getClientForInterface(TestRpcInterface2);
  }
}
