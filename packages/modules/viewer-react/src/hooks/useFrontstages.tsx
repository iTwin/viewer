/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StageUsage } from "@itwin/appui-abstract";
import { StandardFrontstageProvider } from "@itwin/appui-react";
import { useEffect, useState } from "react";

import { DefaultFrontstage } from "../components/app-ui/frontstages/DefaultFrontstage";
import { DefaultContentGroupProvider } from "../components/app-ui/providers";
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
      // we require a connection, so initialize the DefaultFrontstage that contains the views that we want
      // const defaultFrontstageProvider = new DefaultFrontstage(
      //   defaultUiConfig,
      //   viewportOptions,
      //   viewCreatorOptions,
      //   blankConnectionViewState
      // );

      const contentGroup = new DefaultContentGroupProvider(
        viewportOptions,
        viewCreatorOptions,
        blankConnectionViewState
      );

      const defaultFrontstageProvider = new StandardFrontstageProvider({
        id: "DefaultFrontstage",
        usage: StageUsage.General,
        contentGroupProps: contentGroup,
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
