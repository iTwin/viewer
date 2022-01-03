/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./IModelBusy.scss";

import { IModelApp } from "@bentley/imodeljs-frontend";
import { ProgressBar } from "@bentley/ui-core";
import React from "react";

export const IModelBusy = (): JSX.Element => {
  return (
    <div data-testid="loader-wrapper" className="imodelbusy__centered">
      <div className="imodelbusy__contents">
        <ProgressBar
          indeterminate={true}
          labelLeft={IModelApp.i18n.translateWithNamespace(
            "iTwinViewer",
            "iModels.iModelLoading"
          )}
        />
      </div>
    </div>
  );
};

export default IModelBusy;
