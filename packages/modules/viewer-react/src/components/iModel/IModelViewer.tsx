/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import type { FrontstageDef, FrontstageProvider } from "@itwin/appui-react";
import { UiFramework } from "@itwin/appui-react";
import { BackstageComposer, ConfigurableUiContent } from "@itwin/appui-react";
import React, { useEffect, useState } from "react";

import type { ViewerFrontstage } from "../../types.js";

/*
In the upgrade to react 18 and enabling StrictMode, the setting of frontstages started failing 50% of the time. From investigation,
the new rendering behavior from react 18 where components are mounted, unmounted, then mounted again and how react now batches useEffect 
hooks was causing a race condition. By adding a state variable and moving the call to setActiveFrontstageDef to its own useEffect hook, 
the issue is no longer occuring.
*/
export const IModelViewer = ({
  frontstages,
}: {
  frontstages: ViewerFrontstage[];
}) => {
  const [defaultFrontstageDef, setDefaultFrontstageDef] =
    useState<FrontstageDef>();

  useEffect(() => {
    if (defaultFrontstageDef) {
      void UiFramework.frontstages.setActiveFrontstageDef(defaultFrontstageDef);
    }
  }, [defaultFrontstageDef]);

  useEffect(() => {
    let defaultFrontstage: FrontstageProvider | undefined; // eslint-disable-line @typescript-eslint/no-deprecated
    frontstages.forEach((viewerFrontstage) => {
      // register the provider
      UiFramework.frontstages.addFrontstageProvider(viewerFrontstage.provider); // eslint-disable-line @typescript-eslint/no-deprecated
      // override the default (last wins)
      if (viewerFrontstage.default) {
        defaultFrontstage = viewerFrontstage.provider;
      }
    });
    // set the active frontstage to the current default
    if (defaultFrontstage) {
      void UiFramework.frontstages
        .getFrontstageDef(defaultFrontstage.id)
        .then((def) => {
          if (def) {
            setDefaultFrontstageDef(def);
          }
        });
    }

    return () => {
      UiFramework.frontstages.clearFrontstageProviders(); // eslint-disable-line @typescript-eslint/no-deprecated
    };
  }, [frontstages]);

  return <ConfigurableUiContent appBackstage={<BackstageComposer />} />;
};
