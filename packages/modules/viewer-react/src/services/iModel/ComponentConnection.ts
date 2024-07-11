/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BentleyError, Logger } from "@itwin/core-bentley";
import type {
  ChangesetIdWithIndex,
  IModelConnectionProps,
  IModelRpcProps,
  RpcNotFoundResponse,
} from "@itwin/core-common";
import {
  BentleyStatus,
  IModelError,
  IModelReadRpcInterface,
  RpcManager,
  RpcOperation,
  RpcRequest,
  RpcRequestEvent,
} from "@itwin/core-common";
import {
  FrontendLoggerCategory,
  IModelConnection,
  IModelRoutingContext,
} from "@itwin/core-frontend";

const loggerCategory = FrontendLoggerCategory.IModelConnection;

type ComponentProps = {
  iTwinId?: string;
  iModelId?: string;
  changeset?: ChangesetIdWithIndex;
};

/**
 * A Connection to a 'Component'. Components are small models to be used within a larger iModel.
 * They contain documents which may or may not contain a .dgn/.bim/etc
 * This similar to a `CheckpointConnection` except:
 * - We do not hit the iModelHub to get the latest changeset.
 * - getRpcProps is overridden to provide "correct" props for the Component model rather than those returned from getConnectionProps.
 *
 * @See https://docs.bentley.com/LiveContent/web/AECOsim%20Building%20Designer%20Help-v2/en/GUID-CCDE2FF6-C63E-4876-B3AE-5F2B33EF8547.html
 * for more about components.
 */

export class ComponentConnection extends IModelConnection {
  public iModelProps: IModelConnectionProps;
  private _documentId: string;
  private _isClosed?: boolean = false;

  public override get isClosed(): boolean {
    return this._isClosed ? true : false;
  }

  constructor(iModelProps: IModelConnectionProps) {
    super(iModelProps);

    this.iModelProps = iModelProps;

    if (!iModelProps.changeset?.id) {
      throw new IModelError(
        BentleyStatus.ERROR,
        "DocumentId is required for a ComponentConnection"
      );
    }
    this._documentId = iModelProps.changeset?.id;
  }

  /** Type guard for instanceof `ComponentConnection */
  public isComponentConnection(): this is ComponentConnection {
    return true;
  }

  public static async openRemote(
    contextId: string,
    componentId: string,
    documentId: string
  ): Promise<ComponentConnection> {
    const iModelProps = {
      iTwinId: contextId,
      iModelId: componentId,
      changeset: { id: documentId },
    };

    const routingContext =
      IModelRoutingContext.current || IModelRoutingContext.default;
    const props = await ComponentConnection.callOpen(
      iModelProps,
      routingContext
    );
    const connection = new ComponentConnection(props);

    RpcManager.setIModel(connection);
    connection.routingContext = routingContext;
    RpcRequest.notFoundHandlers.addListener(
      connection._reopenConnectionHandler
    );

    IModelConnection.onOpen.raiseEvent(connection);
    return connection;
  }

  private static async callOpen(
    iModelProps: ComponentProps,
    routingContext: IModelRoutingContext
  ): Promise<IModelConnectionProps> {
    // Try opening the iModel repeatedly accommodating any pending responses from the backend.
    // Waits for an increasing amount of time (but within a range) before checking on the pending request again.
    const connectionRetryIntervalRange = { min: 100, max: 5000 }; // in milliseconds
    let connectionRetryInterval = Math.min(
      connectionRetryIntervalRange.min,
      IModelConnection.connectionTimeout
    );

    const openForReadOperation = RpcOperation.lookup(
      IModelReadRpcInterface,
      "getConnectionProps"
    );
    if (!openForReadOperation) {
      throw new IModelError(
        BentleyStatus.ERROR,
        "IModelReadRpcInterface.getConnectionProps() is not available"
      );
    }
    openForReadOperation.policy.retryInterval = () => connectionRetryInterval;

    Logger.logTrace(loggerCategory, `IModelConnection.open`, iModelProps);
    const startTime = Date.now();

    const removeListener = RpcRequest.events.addListener(
      // eslint-disable-next-line deprecation/deprecation
      (type: RpcRequestEvent, request: RpcRequest) => {
        // eslint-disable-next-line deprecation/deprecation
        if (type !== RpcRequestEvent.PendingUpdateReceived) {
          return;
        }
        if (
          !(openForReadOperation && request.operation === openForReadOperation)
        ) {
          return;
        }

        Logger.logTrace(
          loggerCategory,
          "Received pending open notification in IModelConnection.open",
          iModelProps
        );

        const connectionTimeElapsed = Date.now() - startTime;
        if (connectionTimeElapsed > IModelConnection.connectionTimeout) {
          Logger.logError(
            loggerCategory,
            `Timed out opening connection in IModelConnection.open (took longer than ${IModelConnection.connectionTimeout} milliseconds)`,
            iModelProps
          );
          throw new IModelError(
            BentleyStatus.ERROR,
            "Opening a connection was timed out"
          ); // NEEDS_WORK: More specific error status
        }

        connectionRetryInterval = Math.min(
          connectionRetryIntervalRange.max,
          connectionRetryInterval * 2,
          IModelConnection.connectionTimeout - connectionTimeElapsed
        );
        if (request.retryInterval !== connectionRetryInterval) {
          request.retryInterval = connectionRetryInterval;
          Logger.logTrace(
            loggerCategory,
            `Adjusted open connection retry interval to ${request.retryInterval} milliseconds in IModelConnection.open`,
            iModelProps
          );
        }
      }
    );

    const openPromise = IModelReadRpcInterface.getClientForRouting(
      routingContext.token
    ).getConnectionProps(iModelProps);
    let openResponse: IModelConnectionProps;
    try {
      openResponse = await openPromise;
    } finally {
      Logger.logTrace(
        loggerCategory,
        "Completed open request in IModelConnection.open",
        iModelProps
      );
      removeListener();
    }

    return { ...openResponse, ...iModelProps };
  }

  public override getRpcProps(): IModelRpcProps {
    return {
      key: this._fileKey,
      changeset: { id: this._documentId },
      iModelId: this.iModelId,
      iTwinId: this.iTwinId,
    };
  }

  public async close(): Promise<void> {
    if (this.isClosed) {
      return;
    }

    this.beforeClose();

    RpcRequest.notFoundHandlers.removeListener(this._reopenConnectionHandler);

    this._isClosed = true;
  }

  private _reopenConnectionHandler = async (
    request: RpcRequest<RpcNotFoundResponse>,
    response: any,
    resubmit: () => void,
    reject: (reason?: any) => void
  ) => {
    if (!response.hasOwnProperty("isIModelNotFoundResponse")) {
      reject();
    }

    const iModelRpcProps = request.parameters[0];
    if (this._fileKey !== iModelRpcProps.key) {
      reject();
    } // The handler is called for a different connection than this

    Logger.logTrace(
      loggerCategory,
      "Attempting to reopen connection",
      () => iModelRpcProps
    );

    try {
      const openResponse = await ComponentConnection.callOpen(
        iModelRpcProps,
        this.routingContext
      );
      // The new/reopened connection may have a new rpcKey and/or changesetId, but the other IModelRpcTokenProps should be the same
      this._fileKey = openResponse.key;
      this.changeset = openResponse.changeset!;
    } catch (error) {
      reject(BentleyError.getErrorMessage(error));
    } finally {
    }

    Logger.logTrace(
      loggerCategory,
      "Resubmitting original request after reopening connection",
      iModelRpcProps
    );
    request.parameters[0] = this.getRpcProps(); // Modify the token of the original request before resubmitting it.
    resubmit();
  };
}
