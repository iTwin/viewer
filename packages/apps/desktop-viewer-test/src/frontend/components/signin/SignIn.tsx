/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SignIn.scss";

import { IModelApp } from "@itwin/core-frontend";
import { ElectronRendererAuthorization } from "@itwin/electron-authorization/lib/cjs/ElectronRenderer";
import { SvgUser } from "@itwin/itwinui-icons-react";
import { Button } from "@itwin/itwinui-react";
import React, { useState } from "react";
export const SignIn = () => {
  const [signingIn, setSigningIn] = useState(false);

  const onSignInClick = () => {
    setSigningIn(true);
    if (
      IModelApp.authorizationClient instanceof ElectronRendererAuthorization
    ) {
      IModelApp.authorizationClient.signIn(); // eslint-disable-line @typescript-eslint/no-floating-promises
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
