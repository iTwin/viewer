/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useNavigate } from "@reach/router";
import React, { useContext, useEffect, useState } from "react";

import { ViewerFile, ViewerFileType } from "../../../common/ViewerConfig";
import { SettingsContext } from "../../services/SettingsClient";

export const Recents = () => {
  const [recents, setRecents] = useState<ViewerFile[]>();
  const navigate = useNavigate();
  const userSettings = useContext(SettingsContext);

  useEffect(() => {
    if (userSettings.settings?.recents) {
      setRecents(userSettings.settings?.recents.slice(0, 5) || []);
    }
  }, [userSettings]);

  const openSnapshot = async (snapshotPath?: string) => {
    await navigate(`/snapshot`, { state: { snapshotPath } });
  };

  const openRemote = async (iTwinId?: string, iModelId?: string) => {
    await navigate(`/itwins/${iTwinId}/${iModelId}`);
  };

  return (
    <nav>
      {recents?.map((recent) => {
        let displayValue = recent.displayName;
        // limit display value to 25 chars
        if (displayValue.length > 25) {
          displayValue = `${displayValue.substr(0, 25)}...`;
        }
        switch (recent.type) {
          case ViewerFileType.SNAPSHOT:
            return (
              <span key={recent.path} onClick={() => openSnapshot(recent.path)}>
                {displayValue}
              </span>
            );
          case ViewerFileType.ONLINE:
            return (
              <span
                key={recent.iModelId}
                onClick={() => openRemote(recent.iTwinId, recent.iModelId)}
              >
                {displayValue}
              </span>
            );
          default:
            return null;
        }
      })}
    </nav>
  );
};
