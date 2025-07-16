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
  createPropertyGrid,
  ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react";
import {
  CategoriesTreeComponent,
  createTreeWidget,
  ModelsTreeComponent,
} from "@itwin/tree-widget-react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { viewerRpcs } from "../../../common/ViewerConfig";
import {
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
        {
          id: "TreeWidgetUIProvider",
          getWidgets: () => [
            createTreeWidget({
              trees: [
                {
                  id: ModelsTreeComponent.id,
                  getLabel: () => ModelsTreeComponent.getLabel(),
                  render: (props) => (
                    <ModelsTreeComponent
                      getSchemaContext={(iModel) => iModel.schemaContext}
                      density={props.density}
                      selectionStorage={unifiedSelectionStorage}
                      selectionMode={"extended"}
                      onPerformanceMeasured={props.onPerformanceMeasured}
                      onFeatureUsed={props.onFeatureUsed}
                    />
                  ),
                },
                {
                  id: CategoriesTreeComponent.id,
                  getLabel: () => CategoriesTreeComponent.getLabel(),
                  render: (props) => (
                    <CategoriesTreeComponent
                      getSchemaContext={(iModel) => iModel.schemaContext}
                      density={props.density}
                      selectionStorage={unifiedSelectionStorage}
                      onPerformanceMeasured={props.onPerformanceMeasured}
                      onFeatureUsed={props.onFeatureUsed}
                    />
                  ),
                },
              ],
            }),
          ],
        },
        {
          id: "PropertyGridUIProvider",
          getWidgets: () => [
            createPropertyGrid({
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
            })
          ],
        },
        new MeasureToolsUiItemsProvider(),
        new IModelMergeItemsProvider(),
      ]}
      enablePerformanceMonitors={true}
      selectionStorage={unifiedSelectionStorage}
    />
  ) : null;
};
