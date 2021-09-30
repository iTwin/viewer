/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { InternetConnectivityStatus } from "@bentley/imodeljs-common";
import { NativeApp } from "@bentley/imodeljs-frontend";
import { useCallback, useEffect, useState } from "react";

export const useConnectivity = () => {
  const [connectivityStatus, setConnectivityStatus] =
    useState<InternetConnectivityStatus>(InternetConnectivityStatus.Online);

  const checkStatus = useCallback(async () => {
    const status = await NativeApp.checkInternetConnectivity();
    setConnectivityStatus(status);
    NativeApp.onInternetConnectivityChanged.addListener((status) => {
      setConnectivityStatus(status);
    });
  }, []);

  useEffect(() => {
    void checkStatus();
  }, []);

  return connectivityStatus;
};
