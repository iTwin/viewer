/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { useEffect, useState } from "react";

import { DefaultFrontstage } from "../components/app-ui/frontstages/DefaultFrontstage";
import type {
  BlankConnectionViewState,
  ItwinViewerUi,
  ViewerFrontstage,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../types";

export const useFrontstages = (
  frontstages?: ViewerFrontstage[],
  defaultUiConfig?: ItwinViewerUi,
  viewportOptions?: ViewerViewportControlOptions,
  viewCreatorOptions?: ViewerViewCreator3dOptions,
  blankConnectionViewState?: BlankConnectionViewState
) => {
  const [finalFrontstages, setFinalFrontstages] =
    useState<ViewerFrontstage[]>();
  const [noConnectionRequired, setNoConnectionRequired] =
    useState<boolean>(false);

  useEffect(() => {
    let allFrontstages: ViewerFrontstage[] = [];
    if (frontstages) {
      allFrontstages = [...frontstages];
      const defaultFrontstages = frontstages.filter(
        (frontstage) => frontstage.default
      );
      if (defaultFrontstages.length > 0) {
        // there should only be one, but check if any default frontstage requires an iModel connection
        let requiresConnection = false;
        for (let i = 0; i < defaultFrontstages.length; i++) {
          if (defaultFrontstages[i].requiresIModelConnection) {
            requiresConnection = true;
            break;
          }
        }
        if (!requiresConnection) {
          // allow to continue to render
          setNoConnectionRequired(true);
          return;
        }
      }
    }

    // initialize the DefaultFrontstage that contains the views that we want
    const defaultFrontstageProvider = new DefaultFrontstage(
      defaultUiConfig,
      viewportOptions,
      viewCreatorOptions,
      blankConnectionViewState
    );

    // add the default frontstage first so that it's default status can be overridden
    allFrontstages.unshift({
      provider: defaultFrontstageProvider,
      default: true,
    });

    setFinalFrontstages(allFrontstages);
  }, [
    frontstages,
    defaultUiConfig,
    viewCreatorOptions,
    viewportOptions,
    blankConnectionViewState,
  ]);

  return { finalFrontstages, noConnectionRequired };
};
