/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import { IModelGrid, IModelGridProps } from "@itwin/imodel-browser-react";
import { useNavigate } from "@reach/router";
import React from "react";

export const SelectIModel = ({ accessToken, projectId }: IModelGridProps) => {
  const navigate = useNavigate();
  return (
    <div className="idp-scrolling-container select-imodel">
      <div className="idp-scrolling-content">
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
