/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/


import { BackstageItem } from "@bentley/ui-abstract";
import {
  ConfigurableUiContent,
  FrameworkVersion,
  FrontstageManager,
  FrontstageProvider,
  ThemeManager,
} from "@bentley/ui-framework";
import React, { useEffect } from "react";

import { ViewerFrontstage } from "../../types";
import AppBackstageComposer from "../app-ui/backstage/AppBackstageComposer";

interface ModelProps {
  frontstages: ViewerFrontstage[];
  backstageItems: BackstageItem[];
  uiFrameworkVersion?: FrameworkVersion;
}

export const IModelViewer: React.FC<ModelProps> = ({
  frontstages,
  backstageItems,
  uiFrameworkVersion,
}: ModelProps) => {
  useEffect(() => {
    let defaultFrontstage: FrontstageProvider | undefined;
    frontstages.forEach((viewerFrontstage) => {
      // register the provider
      FrontstageManager.addFrontstageProvider(viewerFrontstage.provider);
      // override the default (last wins)
      if (viewerFrontstage.default) {
        defaultFrontstage = viewerFrontstage.provider;
      }
    });
    // set the active frontstage to the current default
    if (defaultFrontstage) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      FrontstageManager.setActiveFrontstageDef(defaultFrontstage.frontstageDef);
    }
    return () => {
      FrontstageManager.clearFrontstageDefs();
    };
  }, [frontstages]);

  // there will always be at least one (for the default frontstage). Wait for it to be loaded into the list before rendering the content
  return backstageItems.length > 0 ? (
    <ThemeManager>
      <FrameworkVersion version={uiFrameworkVersion || "2"}>
        <ConfigurableUiContent
          appBackstage={<AppBackstageComposer items={backstageItems} />}
        />
      </FrameworkVersion>
    </ThemeManager>
  ) : null;
};
