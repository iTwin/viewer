/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "@itwin/desktop-viewer-react";
import { MeasureToolsUiItemsProvider } from "@itwin/measure-tools-react";
import {
  AncestorsNavigationControls,
  CopyPropertyTextContextMenuItem,
  PropertyGridUiItemsProvider,
  ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react";
import { TreeWidgetUiItemsProvider } from "@itwin/tree-widget-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { viewerRpcs } from "../../../common/ViewerConfig";
import {
  getSchemaContext,
  unifiedSelectionStorage,
} from "../../../selectionStorage";
import { IModelMergeItemsProvider } from "../../extensions";
export interface ViewerRouteState {
  filePath?: string;
}

export const ViewerRoute = () => {
  const location = useLocation();
  const [filePath, setFilePath] = useState<string>();

  useEffect(() => {
    const routeState = location?.state as ViewerRouteState | undefined;
    if (routeState?.filePath) {
      setFilePath(routeState?.filePath);
    }
  }, [location?.state]);

  return filePath ? (
    <Viewer
      clientId={process.env.IMJS_VIEWER_CLIENT_ID ?? ""}
      rpcInterfaces={viewerRpcs}
      filePath={filePath}
      uiProviders={[
        new ViewerNavigationToolsProvider(),
        new ViewerContentToolsProvider({
          vertical: {
            measureGroup: false,
          },
        }),
        new ViewerStatusbarItemsProvider(),
        new TreeWidgetUiItemsProvider(),
        new PropertyGridUiItemsProvider({
          propertyGridProps: {
            autoExpandChildCategories: true,
            ancestorsNavigationControls: (props) => (
              <AncestorsNavigationControls {...props} />
            ),
            contextMenuItems: [
              (props) => <CopyPropertyTextContextMenuItem {...props} />,
            ],
            settingsMenuItems: [
              (props) => (
                <ShowHideNullValuesSettingsMenuItem {...props} persist={true} />
              ),
            ],
          },
        }),
        new MeasureToolsUiItemsProvider(),
        new IModelMergeItemsProvider(),
      ]}
      enablePerformanceMonitors={true}
      selectionStorage={unifiedSelectionStorage}
      getSchemaContext={getSchemaContext}
    />
  ) : null;
};
