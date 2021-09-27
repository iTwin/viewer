/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ElectronHost } from "@bentley/electron-manager/lib/ElectronBackend";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

import { ViewerFile, ViewerSettings } from "../common/ViewerConfig";

class UserSettings {
  private _settings: ViewerSettings;
  private _dataPath: string;

  constructor() {
    // cannot set here as we are using ElectronHost.app to obtain and it will not yet be initialized
    this._dataPath = "";
    this._settings = {};
  }

  /**
   * Write the settings.json file to user's app data directory
   */
  private _writeSettings() {
    writeFileSync(
      join(this.dataPath, "settings.json"),
      JSON.stringify(this.settings)
    );
  }

  /**
   * Generate default settings values
   */
  private defaultSettings() {
    this._settings.defaultRecent = false;
    this._settings.recents = [];
    this._writeSettings();
  }

  public get dataPath() {
    if (!this._dataPath) {
      this._dataPath = ElectronHost.app
        .getPath("userData")
        .replace("/Electron", "/iTwin Viewer");
      if (!existsSync(this._dataPath)) {
        mkdirSync(this._dataPath);
      }
    }
    return this._dataPath;
  }

  public get settings() {
    if (Object.keys(this._settings).length === 0) {
      if (!existsSync(join(this.dataPath, "settings.json"))) {
        this.defaultSettings();
      }
      this._settings = JSON.parse(
        readFileSync(join(this.dataPath, "settings.json"), "utf8")
      ) as ViewerSettings;
    }
    return this._settings;
  }

  /**
   * Add a recent file entry
   * @param file
   */
  public addRecent(file: ViewerFile) {
    if (!this.settings.recents) {
      this._settings.recents = [file];
    } else {
      // max out at 50 (currently displaying 5, but this can be adjusted)
      if (this.settings.recents.length === 50) {
        this.settings.recents.splice(49, 1);
      }
      // remove if it already exists to keep recents unique
      const existing = this.settings.recents.findIndex(
        (existingFile) =>
          (file.path && existingFile.path === file.path) ||
          (file.iModelId &&
            existingFile.iTwinId === file.iTwinId &&
            existingFile.iModelId === file.iModelId)
      );
      if (existing > 0) {
        this.settings.recents.splice(existing, 1);
      }

      // add to the top (if not already there)
      if (existing !== 0) {
        this.settings.recents.unshift(file);
      }
    }
    this._writeSettings();
  }
}

export default new UserSettings();
