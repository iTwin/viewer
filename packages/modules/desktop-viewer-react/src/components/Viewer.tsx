/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { BaseViewer, ViewerProps } from "@itwin/viewer-react";
import React from "react";

export const Viewer = (props: ViewerProps) => {
  const onIModelAppInit = () => {
    // TODO desktop specific things
    if (props.onIModelAppInit) {
      props.onIModelAppInit();
    }
  };

  return <BaseViewer onIModelAppInit={onIModelAppInit} {...props} />;
};
