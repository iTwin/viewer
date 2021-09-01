/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { IModelApp } from "@bentley/imodeljs-frontend";
import { NativeAppAuthorization } from "@bentley/imodeljs-frontend";
import { SignIn as SignInBase } from "@bentley/ui-framework";
import { useDesktopViewerInitializer } from "@itwin/desktop-viewer-react";
import { Button } from "@itwin/itwinui-react";
import React, { useCallback, useEffect, useState } from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";

// TODO Kevin cleanup
export const SignIn = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [authClient, setAuthClient] = useState<NativeAppAuthorization>();
  const initialized = useDesktopViewerInitializer();

  const signingInMessage =
    "Sign In has started - please switch to your browser and enter your credentials"; //TODO localize

  // const getAuthClient = useCallback(async () => {
  //   const config = await ITwinViewerApp.ipcCall.getConfig();
  //   setAuthClient(AuthClient.getClient(config.authConfig));
  // }, []);

  // useEffect(() => {
  //   getAuthClient();
  // }, [getAuthClient]);

  const onSignIn = () => {
    console.log(IModelApp.authorizationClient);
    setSigningIn(true);
    authClient?.signIn();
  };

  const onWorkOffline = () => {
    //TODO select snapshot
  };

  const onRegister = () => {
    window.open("https://developer.bentley.com/register/", "_blank");
  };

  return (
    // <div>
    //   <span className="">{signingInMessage}</span>
    //   <Button
    //     className=""
    //     styleType="cta"
    //     disabled={signingIn || !authClient}
    //     onClick={onSignIn}
    //   >
    //     {"Sign In"}
    //   </Button>
    // </div>
    <SignInBase
      //  onSignIn={onSignIn}
      onRegister={onRegister}
      onOffline={onWorkOffline}
      //  disableSignInOnClick={true}
      // signingInMessage={signingInMessage}
    />
  );
};
