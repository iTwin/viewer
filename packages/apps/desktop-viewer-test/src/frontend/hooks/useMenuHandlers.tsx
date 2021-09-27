/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IpcApp } from "@bentley/imodeljs-frontend";
import { NavigateFn } from "@reach/router";
import { useContext, useEffect } from "react";

import { channelName } from "../../common/ViewerConfig";
import { ITwinViewerApp } from "../app/ITwinViewerApp";
import { SettingsContext } from "../services/SettingsClient";

export const useMenuHandlers = (navigate: NavigateFn) => {
  const userSettings = useContext(SettingsContext);

  useEffect(() => {
    IpcApp.addListener(channelName, async (sender, arg) => {
      switch (arg) {
        case "snapshot":
          const snapshotPath = await ITwinViewerApp.getSnapshotFile();
          if (snapshotPath) {
            void userSettings.addRecentSnapshot(snapshotPath);
            await navigate(`/snapshot`, { state: { snapshotPath } });
          }
          break;
        case "remote":
          await navigate("/itwins");
          break;
        case "home":
          await navigate("/");
          break;
        case "preferences":
          alert("Coming Soon!");
          break;
      }
    });
  }, []);
};
