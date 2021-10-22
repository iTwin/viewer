/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./IModelBusy.scss";

import { IModelApp } from "@itwin/core-frontend";
import { ProgressLinear } from "@itwin/itwinui-react";
import React from "react";

export const IModelBusy = (): JSX.Element => {
  return (
    <div data-testid="loader-wrapper" className="imodelbusy__centered">
      <div className="imodelbusy__contents">
        <ProgressLinear
          indeterminate={true}
          labels={[
            IModelApp.localization.getLocalizedString(
              "iTwinViewer:iModels.iModelLoading"
            ),
          ]}
        />
      </div>
    </div>
  );
};

export default IModelBusy;
