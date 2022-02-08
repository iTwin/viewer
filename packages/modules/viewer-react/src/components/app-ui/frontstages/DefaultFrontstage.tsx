/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StageUsage, StandardContentLayouts } from "@itwin/appui-abstract";
import {
  ContentGroup,
  ContentGroupProvider,
  CoreTools,
  Frontstage,
  FrontstageProvider,
  IModelViewportControl,
  StagePanel,
  UiFramework,
  Widget,
  Zone,
} from "@itwin/appui-react";
import type { IModelConnection, ViewState } from "@itwin/core-frontend";
import { ViewCreator3d } from "@itwin/core-frontend";
import * as React from "react";

import { createBlankViewState } from "../../../services/iModel/ViewCreatorBlank";
import type {
  BlankConnectionViewState,
  ItwinViewerUi,
  ViewerViewCreator3dOptions,
  ViewerViewportControlOptions,
} from "../../../types";
import { AppStatusBarWidget } from "../statusbars/AppStatusBar";
import { BasicNavigationWidget, BasicToolWidget } from "../widgets";

/**
 * Use a Provider to provide the content group
 */
class DefaultFrontstageContentGroupProvider extends ContentGroupProvider {
  private _viewportOptions: ViewerViewportControlOptions | undefined;
  private _blankConnectionViewState: BlankConnectionViewState | undefined;
  private _viewCreatorOptions: ViewerViewCreator3dOptions | undefined;

  constructor(
    viewportOptions?: ViewerViewportControlOptions,
    viewCreatorOptions?: ViewerViewCreator3dOptions,
    blankConnectionViewStateOptions?: BlankConnectionViewState
  ) {
    super();
    this._viewportOptions = viewportOptions;
    this._blankConnectionViewState = blankConnectionViewStateOptions;
    this._viewCreatorOptions = viewCreatorOptions;
  }

  async getViewState(
    connection: IModelConnection | undefined
  ): Promise<ViewState | undefined> {
    if (!connection || (!connection.isBlank && connection.isClosed)) {
      return;
    }
    let view: ViewState | undefined;
    if (this._viewportOptions?.viewState) {
      if (typeof this._viewportOptions?.viewState === "function") {
        view = await this._viewportOptions?.viewState(connection);
      } else {
        view = this._viewportOptions?.viewState;
      }
    }
    if (
      !this._viewportOptions?.alwaysUseSuppliedViewState &&
      (!view ||
        (view.iModel.iModelId !== connection.iModelId && connection.isOpen))
    ) {
      if (connection.isBlankConnection()) {
        view = createBlankViewState(connection, this._blankConnectionViewState);
      } else {
        // attempt to construct a default viewState
        const viewCreator = new ViewCreator3d(connection);

        const options: ViewerViewCreator3dOptions = this._viewCreatorOptions
          ? { ...this._viewCreatorOptions }
          : { useSeedView: true };

        if (options.useSeedView === undefined) {
          options.useSeedView = true;
        }

        view = await viewCreator.createDefaultView(options);
        UiFramework.setActiveSelectionScope("top-assembly");
      }

      // Should not be undefined
      if (!view) {
        throw new Error("No default view state for the imodel!");
      }
      // Set default view state
      UiFramework.setDefaultViewState(view);
    }
    return view;
  }

  public async provideContentGroup(): Promise<ContentGroup> {
    const iModelConnection = UiFramework.getIModelConnection();
    const viewState = await this.getViewState(iModelConnection);
    return new ContentGroup({
      id: "content-group",
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "viewport",
          classId: IModelViewportControl,
          applicationData: {
            ...this._viewportOptions,
            viewState,
            iModelConnection,
          },
        },
      ],
    });
  }
}

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
    this._contentGroup = new DefaultFrontstageContentGroupProvider(
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
