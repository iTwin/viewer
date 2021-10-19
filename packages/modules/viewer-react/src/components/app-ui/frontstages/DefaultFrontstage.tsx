/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StageUsage, StandardContentLayouts } from "@itwin/appui-abstract";
import {
  ContentGroup,
  CoreTools,
  Frontstage,
  FrontstageProvider,
  IModelViewportControl,
  StagePanel,
  UiFramework,
  Widget,
  Zone,
} from "@itwin/appui-react";
import { ViewState } from "@itwin/core-frontend";
import * as React from "react";

import { ItwinViewerUi, ViewerViewportControlOptions } from "../../../types";
import { AppStatusBarWidget } from "../statusbars/AppStatusBar";
import { BasicNavigationWidget, BasicToolWidget } from "../widgets";

// TODO 3.0 refactor?
// const getContentGroup = (viewState: ViewState, viewportOptions: IModelViewportControlOptions): ContentGroupProps =>{
//  return {id: "main", contents: [

//  new ContentGroup({
//    id: "viewport-content-group",
//    layout: StandardContentLayouts.singleView,
//   contents: [
//     {
//       id: "viewport",
//       classId: IModelViewportControl,
//       applicationData: {
//         iModelConnection: UiFramework.getIModelConnection(),
//         ...viewportOptions,
//         viewState: viewState
//       },
//     },
//   ],
// })];
// };

// export const getDefaultFrontstage = (
//   viewState: ViewState,
//   uiConfig?: ItwinViewerUi,
//   viewportOptions?: IModelViewportControlOptions
// ) => {
//   const frontstageProps: StandardFrontstageProps = {
//     id: "DefaultFrontstage",
//     usage: StageUsage.General,
//     contentGroupProps: getContentGroup(viewState, viewportOptions)
//   };

//   return new StandardFrontstageProvider(frontstageProps);
// };

/**
 * Default Frontstage for the iTwinViewer
 */
export class DefaultFrontstage extends FrontstageProvider {
  // constants
  public id = "DefaultFrontstage";
  static MAIN_CONTENT_ID = "Main";
  static DEFAULT_TOOL_WIDGET_KEY = "DefaultToolWidget";
  static DEFAULT_TOOL_SETTINGS_KEY = "DefaultToolSettings";
  static DEFAULT_NAVIGATION_WIDGET_KEY = "DefaultNavigationWidget";
  static DEFAULT_TREE_WIDGET_KEY = "DefaultTreeWidget";
  static DEFAULT_STATUS_BAR_WIDGET_KEY = "DefaultStatusBarWidget";
  static DEFAULT_PROPERTIES_WIDGET_KEY = "DefaultPropertiesWidgetKey";

  // Content group for all layouts
  private _contentGroup: ContentGroup;

  private _uiConfig?: ItwinViewerUi;

  constructor(
    public viewState: ViewState,
    uiConfig?: ItwinViewerUi,
    viewportOptions?: ViewerViewportControlOptions
  ) {
    super();

    this._uiConfig = uiConfig;

    // Create the content group.
    this._contentGroup = new ContentGroup({
      id: DefaultFrontstage.MAIN_CONTENT_ID,
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "viewport",
          classId: IModelViewportControl.id,
          applicationData: {
            ...viewportOptions,
            iModelConnection: UiFramework.getIModelConnection(),
            viewState: this.viewState,
          },
        },
      ],
    });
  }

  /** Define the Frontstage properties */
  public get frontstage(): JSX.Element {
    return (
      <Frontstage
        id="DefaultFrontstage"
        defaultTool={CoreTools.selectElementCommand}
        contentGroup={this._contentGroup}
        isInFooterMode={true}
        usage={StageUsage.General}
        contentManipulationTools={
          <Zone
            widgets={[
              <Widget
                key={DefaultFrontstage.DEFAULT_TOOL_WIDGET_KEY}
                isFreeform={true}
                element={
                  <BasicToolWidget
                    config={this._uiConfig?.contentManipulationTools}
                  />
                }
              />,
            ]}
          />
        }
        toolSettings={
          <Zone
            widgets={
              !this._uiConfig?.hideToolSettings
                ? [
                    <Widget
                      key={DefaultFrontstage.DEFAULT_TOOL_SETTINGS_KEY}
                      isToolSettings={true}
                    />,
                  ]
                : []
            }
          />
        }
        viewNavigationTools={
          <Zone
            widgets={[
              <Widget
                key={DefaultFrontstage.DEFAULT_NAVIGATION_WIDGET_KEY}
                isFreeform={true}
                element={
                  <BasicNavigationWidget
                    config={this._uiConfig?.navigationTools}
                  />
                }
              />,
            ]}
          />
        }
        statusBar={
          <Zone
            widgets={
              !this._uiConfig?.hideDefaultStatusBar
                ? [
                    <Widget
                      key={DefaultFrontstage.DEFAULT_STATUS_BAR_WIDGET_KEY}
                      isStatusBar={true}
                      control={AppStatusBarWidget}
                    />,
                  ]
                : []
            }
          />
        }
        rightPanel={<StagePanel allowedZones={[6, 9]} />}
        bottomPanel={<StagePanel allowedZones={[7, 8, 9]} />}
        leftPanel={<StagePanel allowedZones={[1, 4, 7]} />}
      />
    );
  }
}
