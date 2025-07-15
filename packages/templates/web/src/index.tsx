/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./index.css";
import "@itwin/itwinui-react/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./components/Routes";

if (!import.meta.env.IMJS_AUTH_CLIENT_CLIENT_ID) {
  throw new Error(
    "Please add a valid OIDC client id to the .env file and restart. See the README for more information."
  );
}
if (!import.meta.env.IMJS_AUTH_CLIENT_SCOPES) {
  throw new Error(
    "Please add valid scopes for your OIDC client to the .env file and restart. See the README for more information."
  );
}
if (!import.meta.env.IMJS_AUTH_CLIENT_REDIRECT_URI) {
  throw new Error(
    "Please add a valid redirect URI to the .env file and restart. See the README for more information."
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
