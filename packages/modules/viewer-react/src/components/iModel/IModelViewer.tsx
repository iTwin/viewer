/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type {
  BackstageItem,
  FrontstageDef,
  FrontstageProvider,
} from "@itwin/appui-react";
import { UiFramework } from "@itwin/appui-react";
import {
  BackstageComposer,
  ConfigurableUiContent,
  ThemeManager,
} from "@itwin/appui-react";
import React, { useEffect, useState } from "react";

import type { ViewerFrontstage } from "../../types";
interface ModelProps {
  frontstages: ViewerFrontstage[];
  backstageItems?: BackstageItem[]; // TODO next remove this and just use the UiItemsManager to get the items in the next major version
}

export const IModelViewer: React.FC<ModelProps> = ({
  frontstages,
  backstageItems,
}: ModelProps) => {
  const [defaultFrontstageDef, setDefaultFrontstageDef] =
    useState<FrontstageDef>();

  useEffect(() => {
    if (defaultFrontstageDef) {
      void UiFramework.frontstages.setActiveFrontstageDef(defaultFrontstageDef);
    }
  }, [defaultFrontstageDef]);

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
      void UiFramework.frontstages
        .getFrontstageDef(defaultFrontstage.id)
        .then((def) => {
          if (def) {
            setDefaultFrontstageDef(def);
          }
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
