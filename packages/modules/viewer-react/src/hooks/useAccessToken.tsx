/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { AccessToken } from "@itwin/core-bentley";
import { IModelApp } from "@itwin/core-frontend";
import { useCallback, useEffect, useState } from "react";

import { BaseInitializer } from "..";
import { useIsMounted } from "./useIsMounted";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<AccessToken>();
  const isMounted = useIsMounted();

  const getAccessToken = useCallback(async () => {
    if (BaseInitializer.authClient?.hasSignedIn) {
      const token = await IModelApp.authorizationClient?.getAccessToken();
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    void getAccessToken();
  }, [getAccessToken]);

  useEffect(() => {
    BaseInitializer.authClient?.onAccessTokenChanged.addListener((token: any) => {
      if (isMounted.current) {
        setAccessToken(token);
      }
    });
  }, [isMounted]);

  return accessToken;
};
