/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import { IModelGrid, IModelGridProps } from "@itwin/imodel-browser-react";
import { Title } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import React from "react";

interface SelectIModelProps extends IModelGridProps {
  projectName?: string;
}

export const SelectIModel = ({
  accessToken,
  projectId,
  projectName,
}: SelectIModelProps) => {
  const navigate = useNavigate();
  return (
    <div className="itv-scrolling-container select-imodel">
      <div className={"itv-content-margins"}>
        <Title>{`iModels for ${projectName}`}</Title>
      </div>
      <div className="itv-scrolling-content">
        <IModelGrid
          accessToken={accessToken}
          projectId={projectId}
          onThumbnailClick={(imodel) => {
            void navigate(`${projectId}/${imodel.id}`);
          }}
        />
      </div>
    </div>
  );
};
