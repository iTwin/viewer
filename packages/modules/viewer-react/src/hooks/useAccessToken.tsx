/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import { AccessToken } from "@bentley/itwin-client";
import { useCallback, useEffect, useState } from "react";

import { useIsMounted } from "./useIsMounted";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<AccessToken>();
  const isMounted = useIsMounted();

  const getAccessToken = useCallback(async () => {
    if (IModelApp.authorizationClient?.hasSignedIn) {
      const token = await IModelApp.authorizationClient?.getAccessToken();
      setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    void getAccessToken();
  }, [getAccessToken]);

  useEffect(() => {
    IModelApp?.authorizationClient?.onUserStateChanged.addListener((token) => {
      if (isMounted.current) {
        setAccessToken(token);
      }
    });
  }, [isMounted]);

  return accessToken;
};
