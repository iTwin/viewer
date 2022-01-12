/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelHost, IpcHandler } from "@itwin/core-backend";
import { InternetConnectivityStatus } from "@itwin/core-common";
import { ElectronMainAuthorization } from "@itwin/electron-authorization/lib/cjs/ElectronMain";
import type {
  OpenDialogOptions,
  OpenDialogReturnValue,
  SaveDialogOptions,
  SaveDialogReturnValue,
} from "electron";
import { dialog, Menu } from "electron";
import * as minimist from "minimist";

import type {
  ViewerConfig,
  ViewerFile,
  ViewerIpc,
  ViewerSettings,
} from "../common/ViewerConfig";
import { channelName } from "../common/ViewerConfig";
import { getAppEnvVar } from "./AppInfo";
import UserSettings from "./UserSettings";

class ViewerHandler extends IpcHandler implements ViewerIpc {
  private static _authInitialized = false;

  public get channelName() {
    return channelName;
  }
  /**
   * create the config object to send to the frontend
   * @returns Promise<ViewerConfig>
   */
  public async getConfig(): Promise<ViewerConfig> {
    const parsedArgs = minimist(process.argv.slice(2)); // first two arguments are .exe name and the path to ViewerMain.js. Skip them.
    return {
      snapshotName: parsedArgs._[0] ?? getAppEnvVar("SNAPSHOT"),
      clientId: getAppEnvVar("CLIENT_ID") ?? "",
      redirectUri: getAppEnvVar("REDIRECT_URI") ?? "",
      issuerUrl: getAppEnvVar("ISSUER_URL"),
    };
  }
  /**
   * Open file dialog
   * @param options
   * @returns
   */
  public async openFile(
    options: OpenDialogOptions
  ): Promise<OpenDialogReturnValue> {
    return dialog.showOpenDialog(options);
  }

  /**
   * Save file dialog
   * @param options
   * @returns
   */
  public async saveFile(
    options: SaveDialogOptions
  ): Promise<SaveDialogReturnValue> {
    return dialog.showSaveDialog(options);
  }

  /**
   * Get user settings
   * @returns ViewerSettings
   */
  public async getSettings(): Promise<ViewerSettings> {
    return UserSettings.settings;
  }

  /**
   * Add a recent file
   * @param file
   */
  public async addRecentFile(file: ViewerFile): Promise<void> {
    UserSettings.addRecent(file);
  }

  /**
   * Changes due to connectivity status
   * @param connectivityStatus
   */
  public async setConnectivity(
    connectivityStatus: InternetConnectivityStatus
  ): Promise<void> {
    const downloadMenuItem =
      Menu.getApplicationMenu()?.getMenuItemById("download-menu-item");
    if (connectivityStatus === InternetConnectivityStatus.Offline) {
      // offline, disable the download menu item
      if (downloadMenuItem) {
        downloadMenuItem.enabled = false;
      }
    } else if (connectivityStatus === InternetConnectivityStatus.Online) {
      if (!ViewerHandler._authInitialized) {
        // we are online now and were not before so configure the auth backend
        const clientId = getAppEnvVar("CLIENT_ID") ?? "";
        const scope = getAppEnvVar("SCOPE") ?? "";
        const redirectUri = getAppEnvVar("REDIRECT_URI");
        const issuerUrl = getAppEnvVar("ISSUER_URL");

        const authClient = new ElectronMainAuthorization({
          clientId,
          scope,
          redirectUri: redirectUri || undefined, // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
          issuerUrl: issuerUrl || undefined, // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
        });
        await authClient.signInSilent();
        IModelHost.authorizationClient = authClient;
        ViewerHandler._authInitialized = true;
      }
      if (downloadMenuItem) {
        // online so enable the download menu item
        downloadMenuItem.enabled = true;
      }
    }
  }
}

export default ViewerHandler;
