/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BackstageItem, FrontstageProvider } from "@itwin/appui-react";
import { UiFramework } from "@itwin/appui-react";
import {
  BackstageComposer,
  ConfigurableUiContent,
  ThemeManager,
} from "@itwin/appui-react";
import React, { useEffect } from "react";

import type { ViewerFrontstage } from "../../types";
interface ModelProps {
  frontstages: ViewerFrontstage[];
  backstageItems?: BackstageItem[]; // TODO next remove this and just use the UiItemsManager to get the items in the next major version
}

export const IModelViewer: React.FC<ModelProps> = ({
  frontstages,
  backstageItems,
}: ModelProps) => {
  useEffect(() => {
    let defaultFrontstage: FrontstageProvider | undefined;
    frontstages.forEach((viewerFrontstage) => {
      // register the provider
      UiFramework.frontstages.addFrontstageProvider(viewerFrontstage.provider);
      // override the default (last wins)
      if (viewerFrontstage.default) {
        defaultFrontstage = viewerFrontstage.provider;
      }
    });
    // set the active frontstage to the current default
    if (defaultFrontstage) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      void UiFramework.frontstages
        .getFrontstageDef(defaultFrontstage.id)
        .then((frontstageDef) => {
          void UiFramework.frontstages.setActiveFrontstageDef(frontstageDef);
        });
    }
    return () => {
      UiFramework.frontstages.clearFrontstageProviders();
    };
  }, [frontstages]);

  // there will always be at least one (for the default frontstage). Wait for it to be loaded into the list before rendering the content
  return (
    <ThemeManager>
      <ConfigurableUiContent
        appBackstage={
          backstageItems &&
          backstageItems.length > 0 && <BackstageComposer items={[]} />
        }
      />
    </ThemeManager>
  );
};
