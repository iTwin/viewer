/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StageUsage } from "@itwin/appui-abstract";
import type { ContentGroupProvider } from "@itwin/appui-react";
import {
  CoreTools,
  Frontstage,
  FrontstageProvider,
  StagePanel,
  Widget,
  Zone,
} from "@itwin/appui-react";
import * as React from "react";

import type {
  BlankConnectionViewState,
  ItwinViewerUi,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../../../types";
import { DefaultContentGroupProvider } from "../providers";
import { AppStatusBarWidget } from "../statusbars/AppStatusBar";
import { BasicNavigationWidget, BasicToolWidget } from "../widgets";

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
  private _contentGroup: ContentGroupProvider;

  private _uiConfig?: ItwinViewerUi;

  constructor(
    uiConfig?: ItwinViewerUi,
    viewportOptions?: ViewerViewportControlOptions,
    viewCreatorOptions?: ViewerViewCreator3dOptions,
    blankConnectionViewState?: BlankConnectionViewState
  ) {
    super();

    this._uiConfig = uiConfig;

    // Create the content group.
    this._contentGroup = new DefaultContentGroupProvider(
      viewportOptions,
      viewCreatorOptions,
      blankConnectionViewState
    );
  }

  /** Define the Frontstage properties */
  public get frontstage(): JSX.Element {
    return (
      <Frontstage
        id="DefaultFrontstage"
        version={3} // this value should be increased when changes are made to Frontstage
        usage={StageUsage.General}
        defaultTool={CoreTools.selectElementCommand}
        contentGroup={this._contentGroup}
        isInFooterMode={true}
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
