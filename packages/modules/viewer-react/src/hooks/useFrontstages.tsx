/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import React, { useEffect, useState } from "react";
import { BackstageAppButton, StageUsage, StandardFrontstageProvider, UiItemsManager } from "@itwin/appui-react";
import { DefaultContentGroupProvider } from "../components/app-ui/providers";

import type {
  BlankConnectionViewState,
  ViewerDefaultFrontstageConfig,
  ViewerFrontstage,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../types";

export interface UseFrontstagesProps {
  frontstages?: ViewerFrontstage[];
  defaultUiConfig?: ViewerDefaultFrontstageConfig;
  viewportOptions?: ViewerViewportControlOptions;
  viewCreatorOptions?: ViewerViewCreator3dOptions;
  blankConnectionViewState?: BlankConnectionViewState;
}

export const ViewerDefaultFrontstageProviderId =
  "iTwinViewer.DefaultFrontstage";

export const useFrontstages = ({
  frontstages,
  blankConnectionViewState,
  defaultUiConfig,
  viewCreatorOptions,
  viewportOptions,
}: UseFrontstagesProps) => {
  const [finalFrontstages, setFinalFrontstages] =
    useState<ViewerFrontstage[]>();
  const [noConnectionRequired, setNoConnectionRequired] =
    useState<boolean>(false);
  const [customDefaultFrontstage, setCustomDefaultFrontstage] =
    useState<boolean>(false);

  useEffect(() => {
    let allFrontstages: ViewerFrontstage[] = [];
    let defaultExists = false;
    let requiresConnection = true;

    if (frontstages) {
      allFrontstages = [...frontstages];
      const defaultFrontstages = frontstages.filter(
        (frontstage) => frontstage.default
      );
      if (defaultFrontstages.length > 0) {
        setCustomDefaultFrontstage(true);
        defaultExists = true;
        // if there are multiple defaults (there should not be), the last wins to be consistent with the default that is used in IModelViewer
        requiresConnection =
          !!defaultFrontstages[defaultFrontstages.length - 1]
            .requiresIModelConnection;

        if (!requiresConnection) {
          // allow to continue to render
          setNoConnectionRequired(true);
        }
      }
    }

    if (requiresConnection) {
      const contentGroup = new DefaultContentGroupProvider(
        viewportOptions,
        viewCreatorOptions,
        blankConnectionViewState
      );

      const defaultFrontstageProvider = new StandardFrontstageProvider({ // eslint-disable-line @typescript-eslint/no-deprecated
        id: ViewerDefaultFrontstageProviderId,
        usage: StageUsage.General,
        contentGroupProps: contentGroup,
        cornerButton: UiItemsManager.getBackstageItems().length ? (
          <BackstageAppButton />
        ) : undefined,
        ...defaultUiConfig,
      });

      // add the default frontstage first so that it's default status can be overridden
      allFrontstages.unshift({
        provider: defaultFrontstageProvider,
        default: !defaultExists,
      });
    }

    setFinalFrontstages(allFrontstages);
  }, [
    frontstages,
    defaultUiConfig,
    viewCreatorOptions,
    viewportOptions,
    blankConnectionViewState,
  ]);

  return { finalFrontstages, noConnectionRequired, customDefaultFrontstage };
};
