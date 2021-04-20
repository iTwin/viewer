/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { BaseBlankViewer } from "@itwin/viewer-react";
import React, { useEffect, useState } from "react";

import { initializeViewer } from "../services/Initializer";
import { WebBlankViewerProps } from "../types";

export const BlankViewer = (props: WebBlankViewerProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    void initializeViewer(props).then(() => {
      setInitialized(true);
    });
  }, []);

  return initialized ? <BaseBlankViewer {...props} /> : null; //TODO loader?
};
