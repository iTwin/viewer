/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.css";
import { type ComponentProps } from "react";
import { AuthorizationState, useAuthorizationContext } from "../Authorization";
import { Viewer } from "./Viewer";
import { ProgressLinear } from "@itwin/itwinui-react";

export function App(props: ComponentProps<typeof Viewer>) {
  const { state } = useAuthorizationContext();

  return (
    <div className="viewer-container">
      {state === AuthorizationState.Pending ? (
        <Loader />
      ) : (
        <Viewer {...props} />
      )}
    </div>
  );
}

function Loader() {
  return (
    <div className="centered">
      <div className="signin-content">
        <ProgressLinear labels={["Loading..."]} />
      </div>
    </div>
  );
}
