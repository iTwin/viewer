/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { AccessToken } from "@itwin/core-bentley";
import { useEffect, useState } from "react";

import { ViewerAuthorization } from "../services/auth";
import { useIsMounted } from "./useIsMounted";

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useState<AccessToken>();
  const isMounted = useIsMounted();

  useEffect(() => {
    const getAccessToken = async () => {
      const token = await ViewerAuthorization.client.getAccessToken();
      setAccessToken(token);
    };

    void getAccessToken();
  }, []);

  useEffect(() => {
    const removeListener =
      ViewerAuthorization.client.onAccessTokenChanged.addListener(
        (token: any) => {
          if (isMounted.current) {
            setAccessToken(token);
          }
        }
      );
    return () => removeListener();
  }, [isMounted]);

  return accessToken;
};
