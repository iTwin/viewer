/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

export enum AuthorizationState {
  Pending,
  Authorized,
}

export interface AuthorizationContext {
  client: BrowserAuthorizationClient;
  state: AuthorizationState;
}

const authorizationContext = createContext<AuthorizationContext>({
  client: new BrowserAuthorizationClient({
    clientId: "",
    redirectUri: "",
    scope: "",
  }),
  state: AuthorizationState.Pending,
});

export function useAuthorizationContext() {
  return useContext(authorizationContext);
}

const createAuthClient = (): AuthorizationContext => {
  const client = new BrowserAuthorizationClient({
    scope: import.meta.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
    clientId: import.meta.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
    redirectUri: import.meta.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
    postSignoutRedirectUri: import.meta.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
    responseType: "code",
    authority: import.meta.env.IMJS_AUTH_AUTHORITY,
  });
  return {
    client,
    state: AuthorizationState.Pending,
  };
};

export function AuthorizationProvider(props: PropsWithChildren<unknown>) {
  const [contextValue, setContextValue] = useState<AuthorizationContext>(() =>
    createAuthClient()
  );

  const authClient = contextValue.client;
  useEffect(() => {
    return authClient.onAccessTokenChanged.addListener(() =>
      setContextValue((prev) => ({
        ...prev,
        state: AuthorizationState.Authorized,
      }))
    );
  }, [authClient]);

  useEffect(() => {
    const signIn = async () => {
      try {
        await authClient.signInSilent();
      } catch {
        await authClient.signInRedirect();
      }
    };

    void signIn();
  }, [authClient]);

  return (
    <authorizationContext.Provider value={contextValue}>
      {props.children}
    </authorizationContext.Provider>
  );
}

export function SignInRedirect() {
  const { client } = useAuthorizationContext();

  useEffect(() => {
    void client.handleSigninCallback();
  }, [client]);

  return <></>;
}
