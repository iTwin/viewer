/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ViewerFile } from "../../../common/ViewerConfig";
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

  const openFile = async (file: ViewerFile) => {
    if (await userSettings.checkFileExists(file)) {
      await navigate(`/viewer`, { state: { filePath: file.path } });
    } else {
      await userSettings.removeRecent(file);
    }
  };

  return (
    <nav>
      {recents?.map((recent) => {
        let displayValue = recent.displayName;
        // limit display value to 25 chars
        if (displayValue.length > 25) {
          displayValue = `${displayValue.substring(0, 25)}...`;
        }

        return (
          <span
            key={recent.path}
            onClick={() => openFile(recent)}
            className={recent.deleted ? "disabled-link" : ""}
          >
            {displayValue}
          </span>
        );
      })}
    </nav>
  );
};
