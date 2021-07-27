/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./IModelBusy.scss";

import { BodyText, LoadingSpinner } from "@bentley/ui-core";
import React from "react";

export const IModelBusy = (): JSX.Element => {
  return (
    // TODO localize text once i18n strategy is in place
    <div data-testid="loader-wrapper" className="imodelbusy__centered">
      <div className="imodelbusy__contents">
        <LoadingSpinner
          message={"Your iModel is loading"}
          messageOnTop={true}
          size={"large"}
        />
      </div>
      <div className="imodelbusy__loadingText">
        <BodyText>{"Rendering your iModel"}</BodyText>
      </div>
    </div>
  );
};

export default IModelBusy;
