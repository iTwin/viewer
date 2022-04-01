/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useNavigate } from "@reach/router";
import React, { useContext, useEffect, useState } from "react";

import type { ViewerFile } from "../../../types";
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

  const openFile = async (filePath?: string) => {
    await navigate(`/viewer`, { state: { filePath } });
  };

  return (
    <nav>
      {recents?.map((recent) => {
        let displayValue = recent.displayName;
        // limit display value to 25 chars
        if (displayValue.length > 25) {
          displayValue = `${displayValue.substr(0, 25)}...`;
        }
        return (
          <span key={recent.path} onClick={() => openFile(recent.path)}>
            {displayValue}
          </span>
        );
      })}
    </nav>
  );
};
