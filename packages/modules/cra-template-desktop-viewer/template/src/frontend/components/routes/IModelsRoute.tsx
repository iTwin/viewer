/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { useAccessToken } from "@itwin/desktop-viewer-react";
import { RouteComponentProps } from "@reach/router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { SelectIModel } from "../modelSelector";
import { SignIn } from "../signin/SignIn";

interface IModelsRouteParams {
  iTwinId?: string;
}
interface IModelsRouteState {
  projectName?: string;
}

export interface IModelContextOptions {
  pendingIModel?: string;
  setPendingIModel: Dispatch<SetStateAction<string | undefined>>;
}

export const IModelContext = createContext({} as IModelContextOptions);

export const IModelsRoute = ({
  iTwinId,
  location,
}: RouteComponentProps<IModelsRouteParams>) => {
  const [projectName, setProjectName] = useState<string>();
  const [pendingIModel, setPendingIModel] = useState<string>();
  const accessToken = useAccessToken();

  useEffect(() => {
    const routeState = location?.state as IModelsRouteState | undefined;
    if (routeState?.projectName) {
      setProjectName(routeState?.projectName);
    }
  }, [location?.state]);

  return (
    <IModelContext.Provider value={{ pendingIModel, setPendingIModel }}>
      {accessToken ? (
        <SelectIModel
          accessToken={accessToken.toTokenString()}
          projectId={iTwinId}
          projectName={projectName}
        />
      ) : (
        <SignIn />
      )}
    </IModelContext.Provider>
  );
};
