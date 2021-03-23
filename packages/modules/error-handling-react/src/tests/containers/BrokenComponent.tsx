/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { Fragment, useEffect } from "react";

export const ErrorMessage = "I'm a broken component";

const BrokenComponent = (): JSX.Element => {
  useEffect(() => {
    throw new Error(ErrorMessage);
  });
  return <Fragment />;
};

export default BrokenComponent;
