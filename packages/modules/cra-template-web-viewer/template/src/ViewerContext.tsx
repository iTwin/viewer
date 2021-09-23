/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { WebAuthorizationOptions } from "@itwin/web-viewer-react";
import React from "react";

export interface ViewerContext {
  contextId: string;
  iModelId: string;
  authOptions: WebAuthorizationOptions;
}

export const defaultContext: ViewerContext = {
  contextId: process.env.IMJS_CONTEXT_ID ?? "",
  iModelId: process.env.IMJS_IMODEL_ID ?? "",
  authOptions: {
    config: {
      scope: process.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
      clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
      redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
      postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
      responseType: "code",
      authority: process.env.IMJS_AUTH_AUTHORITY,
    },
  },
};

const viewerContext = React.createContext(defaultContext);

export default viewerContext;
