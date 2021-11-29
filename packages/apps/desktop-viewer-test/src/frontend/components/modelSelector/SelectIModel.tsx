/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import {
  IModelFull,
  IModelGrid,
  IModelGridProps,
} from "@itwin/imodel-browser-react";
import { Title } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import React, { useContext } from "react";

import { SettingsContext } from "../../services/SettingsClient";

interface SelectIModelProps extends IModelGridProps {
  projectName?: string;
}

export const SelectIModel = ({
  accessToken,
  iTwinId,
  projectName,
}: SelectIModelProps) => {
  const navigate = useNavigate();
  const userSettings = useContext(SettingsContext);

  const selectIModel = async (iModel: IModelFull) => {
    if (iTwinId) {
      void userSettings.addRecentOnline(iTwinId, iModel.id, iModel.name);
    }
    await navigate(`${iTwinId}/${iModel.id}`);
  };

  return (
    <div className="itv-scrolling-container select-imodel">
      <div className={"itv-content-margins"}>
        <Title>{`iModels for ${projectName}`}</Title>
      </div>
      <div className="itv-scrolling-content">
        <IModelGrid
          accessToken={accessToken}
          projectId={projectId}
          onThumbnailClick={selectIModel}
        />
      </div>
    </div>
  );
};
