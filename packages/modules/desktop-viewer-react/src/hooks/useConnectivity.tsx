/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { InternetConnectivityStatus } from "@itwin/core-common";
import { NativeApp } from "@itwin/core-frontend";
import { useCallback, useEffect, useState } from "react";

export const useConnectivity = () => {
  const [connectivityStatus, setConnectivityStatus] =
    useState<InternetConnectivityStatus>(InternetConnectivityStatus.Online);

  const checkStatus = useCallback(async () => {
    await NativeApp.overrideInternetConnectivity(
      window.navigator.onLine ? 0 : 1
    );
    const status = await NativeApp.checkInternetConnectivity();
    setConnectivityStatus(status);
    NativeApp.onInternetConnectivityChanged.addListener((status) => {
      setConnectivityStatus(status);
    });
  }, []);

  useEffect(() => {
    void checkStatus();
  }, [checkStatus]);

  return connectivityStatus;
};
