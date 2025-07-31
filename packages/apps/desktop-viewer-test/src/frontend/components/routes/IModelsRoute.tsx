/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useAccessToken } from "@itwin/desktop-viewer-react";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { SelectIModel } from "../modelSelector";
import { SignIn } from "../signin/SignIn";

interface IModelsRouteState {
  iTwinName?: string;
}

export interface IModelContextOptions {
  pendingIModel?: string;
  setPendingIModel: Dispatch<SetStateAction<string | undefined>>;
}

export const IModelContext = createContext({} as IModelContextOptions);

export const IModelsRoute = () => {
  const { iTwinId } = useParams();
  const location = useLocation();
  const [iTwinName, setITwinName] = useState<string>();
  const [pendingIModel, setPendingIModel] = useState<string>();
  const accessToken = useAccessToken();

  useEffect(() => {
    const routeState = location?.state as IModelsRouteState | undefined;
    if (routeState?.iTwinName) {
      setITwinName(routeState?.iTwinName);
    }
  }, [location?.state]);

  return (
    <IModelContext.Provider value={{ pendingIModel, setPendingIModel }}>
      {accessToken ? (
        <SelectIModel
          accessToken={accessToken}
          iTwinId={iTwinId}
          iTwinName={iTwinName}
        />
      ) : (
        <SignIn />
      )}
    </IModelContext.Provider>
  );
};
