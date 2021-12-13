/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { SnapshotIModelRpcInterface } from "@itwin/core-common";
import type { ElectronAppOpts } from "@itwin/core-electron/lib/cjs/ElectronFrontend";
import { ElectronApp } from "@itwin/core-electron/lib/cjs/ElectronFrontend";
import { IModelApp, NativeAppLogger } from "@itwin/core-frontend";
import { ElectronRendererAuthorization } from "@itwin/electron-authorization/lib/cjs/ElectronRenderer";
import {
  BaseInitializer,
  getIModelAppOptions,
  makeCancellable,
} from "@itwin/viewer-react";

import type { DesktopViewerProps } from "../types";

export class DesktopInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _cancel: (() => void) | undefined;

  /** expose initialized promise */
  public static get initialized(): Promise<void> {
    return this._initialized;
  }

  /** expose initialized cancel method */
  public static cancel: () => void = () => {
    if (DesktopInitializer._initializing) {
      if (DesktopInitializer._cancel) {
        DesktopInitializer._cancel();
      }
      ElectronApp.shutdown().catch(() => {
        // Do nothing, its possible that we never started.
      });
    }
  };

  /** Desktop viewer startup */
  public static async startDesktopViewer(options?: DesktopViewerProps) {
    if (!IModelApp.initialized && !this._initializing) {
      console.log("starting desktop viewer");
      this._initializing = true;

      const cancellable = makeCancellable(function* () {
        const additionalRpcInterfaces = options?.additionalRpcInterfaces ?? [];
        additionalRpcInterfaces.push(SnapshotIModelRpcInterface);

        const iModelAppOpts = getIModelAppOptions({
          ...options,
          additionalRpcInterfaces,
        });

        const authClient = new ElectronRendererAuthorization();
        iModelAppOpts.authorizationClient = authClient;
        BaseInitializer.authClient = authClient;

        const electronViewerOpts: ElectronAppOpts = {
          iModelApp: iModelAppOpts,
        };
        yield ElectronApp.startup(electronViewerOpts);
        NativeAppLogger.initialize();

        console.log("desktop viewer started");
      });

      DesktopInitializer._cancel = cancellable.cancel;
      this._initialized = cancellable.promise
        .catch((err) => {
          if (err.reason !== "cancelled") {
            throw err;
          }
        })
        .finally(() => {
          DesktopInitializer._initializing = false;
          DesktopInitializer._cancel = undefined;
        });
    } else {
      this._initialized = Promise.resolve();
    }
  }
}
