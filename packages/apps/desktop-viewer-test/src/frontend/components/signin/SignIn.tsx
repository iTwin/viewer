/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SignIn.scss";

import { IModelApp } from "@bentley/imodeljs-frontend";
import { SvgUser } from "@itwin/itwinui-icons-react";
import { Button } from "@itwin/itwinui-react";
import React, { useState } from "react";
export const SignIn = () => {
  const [signingIn, setSigningIn] = useState(false);

  const onSignInClick = () => {
    setSigningIn(true);
    IModelApp.authorizationClient?.signIn();
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
