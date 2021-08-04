/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IpcHandler } from "@bentley/imodeljs-backend";
import { dialog } from "electron";
import * as minimist from "minimist";

import { channelName, ViewerConfig, ViewerIpc } from "../common/ViewerConfig";
import { getAppEnvVar } from "./AppInfo";

class ViewerHandler extends IpcHandler implements ViewerIpc {
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
  public async openFile(options: any): Promise<Electron.OpenDialogReturnValue> {
    return dialog.showOpenDialog(options);
  }
}

export default ViewerHandler;
