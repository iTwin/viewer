/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { SnapshotIModelRpcInterface } from "@itwin/core-common";
import {
  ElectronApp,
  ElectronAppOpts,
} from "@itwin/core-electron/lib/cjs/ElectronFrontend";
import { IModelApp } from "@itwin/core-frontend";
import { getIModelAppOptions, makeCancellable } from "@itwin/viewer-react";

import { DesktopViewerProps } from "../types";

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

        const electronViewerOpts: ElectronAppOpts = {
          iModelApp: getIModelAppOptions({
            ...options,
            additionalRpcInterfaces,
          }),
        };
        yield ElectronApp.startup(electronViewerOpts);

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
