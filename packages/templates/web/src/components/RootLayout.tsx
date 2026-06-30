/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import { SvgError } from "@itwin/itwinui-illustrations-react";
import { NonIdealState, ThemeProvider } from "@itwin/itwinui-react";
import { Outlet } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";

import { AuthorizationProvider } from "./Authorization";

export function RootLayout() {
  return (
    <ThemeProvider theme="light">
      <ErrorBoundary
        FallbackComponent={({ error }) => (
          <NonIdealState
            svg={<SvgError />}
            heading={"An error occurred"}
            description={error instanceof Error ? error.message : undefined}
          />
        )}
      >
        <AuthorizationProvider>
          <Outlet />
        </AuthorizationProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
