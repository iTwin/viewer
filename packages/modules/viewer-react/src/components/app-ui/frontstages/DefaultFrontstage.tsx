/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ViewState } from "@bentley/imodeljs-frontend";
import {
  ContentGroup,
  ContentLayoutDef,
  CoreTools,
  Frontstage,
  FrontstageProvider,
  IModelViewportControl,
  StagePanel,
  UiFramework,
  Widget,
  Zone,
  ZoneLocation,
  ZoneState,
} from "@bentley/ui-framework";
import * as React from "react";

import { ItwinViewerUi, ViewerViewportControlOptions } from "../../../types";
import { AppStatusBarWidget } from "../statusbars/AppStatusBar";
import { BasicNavigationWidget, BasicToolWidget } from "../widgets";

/**
 * Default Frontstage for the iTwinViewer
 */
export class DefaultFrontstage extends FrontstageProvider {
  // constants
  static MAIN_CONTENT_ID = "Main";
  static DEFAULT_TOOL_WIDGET_KEY = "DefaultToolWidget";
  static DEFAULT_TOOL_SETTINGS_KEY = "DefaultToolSettings";
  static DEFAULT_NAVIGATION_WIDGET_KEY = "DefaultNavigationWidget";
  static DEFAULT_TREE_WIDGET_KEY = "DefaultTreeWidget";
  static DEFAULT_STATUS_BAR_WIDGET_KEY = "DefaultStatusBarWidget";
  static DEFAULT_PROPERTIES_WIDGET_KEY = "DefaultPropertiesWidgetKey";

  // Content layout for content views
  private _contentLayoutDef: ContentLayoutDef;

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

    this._contentLayoutDef = new ContentLayoutDef({
      id: DefaultFrontstage.MAIN_CONTENT_ID,
    });

    // Create the content group.
    this._contentGroup = new ContentGroup({
      contents: [
        {
          classId: IModelViewportControl,
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
        defaultLayout={this._contentLayoutDef}
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
        centerRight={
          <Zone
            defaultState={ZoneState.Minimized}
            allowsMerging={true}
            widgets={[]}
          />
        }
        bottomRight={
          <Zone
            allowsMerging={true}
            mergeWithZone={ZoneLocation.CenterRight}
            widgets={[]}
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
