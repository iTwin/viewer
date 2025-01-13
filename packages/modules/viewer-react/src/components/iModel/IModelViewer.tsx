/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BackstageItem,
  FrontstageDef,
  FrontstageProvider,
  ThemeId,
} from "@itwin/appui-react";
import { UiFramework, UiItemsManager } from "@itwin/appui-react";
import {
  BackstageComposer,
  ConfigurableUiContent,
  ThemeManager,
} from "@itwin/appui-react";
import React, { useEffect, useState } from "react";

import type { ViewerFrontstage } from "../../types";
interface ModelProps {
  frontstages: ViewerFrontstage[];
  // theme?: ThemeId;
}

/*
In the upgrade to react 18 and enabling StrictMode, the setting of frontstages started failing 50% of the time. From investigation,
the new rendering behavior from react 18 where components are mounted, unmounted, then mounted again and how react now batches useEffect 
hooks was causing a race condition. By adding a state variable and moving the call to setActiveFrontstageDef to its own useEffect hook, 
the issue is no longer occuring.
*/
export const IModelViewer: React.FC<ModelProps> = ({
  frontstages,
}: // theme,
ModelProps) => {
  const [defaultFrontstageDef, setDefaultFrontstageDef] =
    useState<FrontstageDef>();

  useEffect(() => {
    if (defaultFrontstageDef) {
      void UiFramework.frontstages.setActiveFrontstageDef(defaultFrontstageDef);
    }
  }, [defaultFrontstageDef]);

  useEffect(() => {
    let defaultFrontstage: FrontstageProvider | undefined; // eslint-disable-line deprecation/deprecation
    frontstages.forEach((viewerFrontstage) => {
      // register the provider
      UiFramework.frontstages.addFrontstageProvider(viewerFrontstage.provider); // eslint-disable-line deprecation/deprecation
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
      UiFramework.frontstages.clearFrontstageProviders(); // eslint-disable-line deprecation/deprecation
    };
  }, [frontstages]);

  // there will always be at least one (for the default frontstage). Wait for it to be loaded into the list before rendering the content
  return (
    // <ThemeManager theme={theme}>
    <ConfigurableUiContent appBackstage={<BackstageComposer />} />
    // </ThemeManager>
  );
};
