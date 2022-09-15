/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { BackstageItem } from "@itwin/appui-abstract";
import type { FrontstageProvider } from "@itwin/appui-react";
import {
  BackstageComposer,
  ConfigurableUiContent,
  FrameworkVersion,
  FrontstageManager,
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
      FrontstageManager.addFrontstageProvider(viewerFrontstage.provider);
      // override the default (last wins)
      if (viewerFrontstage.default) {
        defaultFrontstage = viewerFrontstage.provider;
      }
    });
    // set the active frontstage to the current default
    if (defaultFrontstage) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      void FrontstageManager.getFrontstageDef(defaultFrontstage.id).then(
        (frontstageDef) => {
          void FrontstageManager.setActiveFrontstageDef(frontstageDef);
        }
      );
    }
    return () => {
      void FrontstageManager.setActiveFrontstageDef(undefined);
      FrontstageManager.clearFrontstageDefs();
      // TODO next replace the above with the below
      // FrontstageManager.clearFrontstageProviders();
    };
  }, [frontstages]);

  // there will always be at least one (for the default frontstage). Wait for it to be loaded into the list before rendering the content
  return (
    <ThemeManager>
      <FrameworkVersion>
        <ConfigurableUiContent
          appBackstage={
            backstageItems &&
            backstageItems.length > 0 && <BackstageComposer items={[]} />
          }
        />
      </FrameworkVersion>
    </ThemeManager>
  );
};
