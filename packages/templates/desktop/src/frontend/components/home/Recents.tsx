/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Home.scss";

import { SvgStatusError } from "@itwin/itwinui-icons-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { ViewerFile } from "../../../common/ViewerConfig";
import { SettingsContext } from "../../services/SettingsContext";

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
      navigate(`/viewer`, { state: { filePath: file.path } });
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
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <span
            key={recent.displayName}
            onClick={() => openFile(recent)}  // eslint-disable-line @typescript-eslint/promise-function-async
            className={!recent.path ? "disabled-link-recent" : ""}
            title={!recent.path ? "Deleted" : ""}
          >
            {!recent.path && <SvgStatusError />}
            {displayValue}
          </span>
        );
      })}
    </nav>
  );
};
