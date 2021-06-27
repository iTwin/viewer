/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  ElectronApp,
  ElectronAppOpts,
} from "@bentley/electron-manager/lib/ElectronFrontend";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { getIModelAppOptions } from "@itwin/viewer-react";

import { DesktopViewerProps } from "../types";

export class DesktopInitializer {
  private static _initialized: Promise<void>;
  private static _initializing = false;
  private static _reject: (() => void) | undefined;

  /** expose initialized promise */
  public static get initialized(): Promise<void> {
    return this._initialized;
  }

  /** expose initialized cancel method */
  public static cancel: () => void = () => {
    if (DesktopInitializer._initializing) {
      if (DesktopInitializer._reject) {
        DesktopInitializer._reject();
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
      this._initialized = new Promise(async (resolve, reject) => {
        try {
          this._reject = () => reject("Desktop Startup Cancelled");
          const electronViewerOpts: ElectronAppOpts = {
            iModelApp: getIModelAppOptions(options),
          };
          await ElectronApp.startup(electronViewerOpts);

          console.log("desktop viewer started");
          resolve();
        } catch (error) {
          console.error(error);
          reject(error);
        } finally {
          this._initializing = false;
          this._reject = undefined;
        }
      });
    }
  }
}
