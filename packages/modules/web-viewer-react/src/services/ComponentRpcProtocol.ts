/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { OpenAPIInfo, RpcRequest } from "@itwin/core-common";
import {
  BentleyCloudRpcProtocol,
  BentleyStatus,
  IModelError,
  RpcConfiguration,
  RpcOperation,
} from "@itwin/core-common";

export function createComponentRpcProtocol(
  uriPrefix: string,
  info: OpenAPIInfo // eslint-disable-line deprecation/deprecation
): typeof BentleyCloudRpcProtocol {
  const ComponentRpcProtocol = class ComponentRpcProtocol extends BentleyCloudRpcProtocol {
    public override pathPrefix: string = uriPrefix;
    public info = info;

    public override supplyPathForOperation(
      operation: RpcOperation,
      request: RpcRequest<any> | undefined
    ): string {
      const prefix = this.pathPrefix;
      const appTitle = this.info.title;
      const appVersion = this.info.version;
      const operationId = `${operation.interfaceDefinition.interfaceName}-${operation.interfaceVersion}-${operation.operationName}`;

      let appMode = "";
      let context = "";
      let component = "";
      let document = "";

      if (request === undefined) {
        appMode = "{modeId}";
        context = "{iTwinId}";
        component = "{iModelId}";
        document = "{changeSetId}";
      } else {
        let token =
          operation.policy.token(request) || RpcOperation.fallbackToken;

        if (!token || !token.iModelId) {
          if (RpcConfiguration.disableRoutingValidation) {
            token = { key: "" };
          } else {
            throw new IModelError(
              BentleyStatus.ERROR,
              "Invalid iModelToken for RPC operation request"
            );
          }
        }

        context = encodeURIComponent(token.iTwinId || "");
        component = encodeURIComponent(token.iModelId!);

        document = token.changeset?.id || "0";
        appMode = "1";
      }

      return `${prefix}/${appTitle}/${appVersion}/mode/1/imodel/context/${context}/component/${component}/document/${document}/${operationId}`;
    }
  };

  return ComponentRpcProtocol;
}
