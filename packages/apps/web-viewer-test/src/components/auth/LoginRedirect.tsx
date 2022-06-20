/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { AuthorizationClient, RedirectKey } from "../../services/auth";

const LoginRedirect = () => {
  const [isAuthVerified, setIsAuthVerified] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  const displayMessage = "Validating login...";

  useEffect(() => {
    AuthorizationClient.initializeOidc()
      .then(() => {
        AuthorizationClient.oidcClient
          .signInSilent()
          .then(() => {
            setRedirectPath(sessionStorage.getItem(RedirectKey) ?? "/");
            setIsAuthVerified(true);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {isAuthVerified ? (
        <Navigate to={redirectPath} />
      ) : (
        <p>{displayMessage}</p>
      )}
    </div>
  );
};

export default LoginRedirect;
