/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BeEvent } from "@itwin/core-bentley";
import "./SignIn.scss";

import { IModelApp } from "@itwin/core-frontend";
import { ElectronRendererAuthorization } from "@itwin/electron-authorization/Renderer";
import { SvgUser } from "@itwin/itwinui-icons-react";
import { Button } from "@itwin/itwinui-react";
import React, { useState } from "react";
import { AuthorizationClient } from "@itwin/core-common";
export const SignIn = () => {
  const [signingIn, setSigningIn] = useState(false);

  const isElectronRendererAuth = (client: any): client is ElectronRendererAuthorization => {
    return client?.onAccessTokenChanged instanceof BeEvent &&
      typeof client?.signIn === "function" &&
      typeof client?.signOut === "function" &&
      typeof client?.signInSilent === "function" &&
      typeof client?.getAccessToken === "function";
  };

  const onSignInClick = async () => {
    setSigningIn(true);
    if (
      isElectronRendererAuth(IModelApp.authorizationClient)
    ) {
      await IModelApp.authorizationClient?.signIn();
    }
  };

  return (
    <div className="signin-container">
      <div className="signin">
        <SvgUser className="signin-user" />
        <Button
          className="signin-button"
          styleType="cta"
          disabled={signingIn}
          onClick={onSignInClick}
        >
          Sign In
        </Button>
        {signingIn && (
          <span>Please switch to your browser and enter your credentials</span>
        )}
      </div>
    </div>
  );
};
