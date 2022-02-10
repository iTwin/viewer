/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { FrontstageProps } from "@itwin/appui-react";
import {
  BasicNavigationWidget,
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
import type { ViewStateProp } from "@itwin/imodel-components-react";
import React from "react";

export class MultiViewportFrontstage extends FrontstageProvider {
  // constants
  public id = "MultiViewportFrontstage";
  public static MAIN_CONTENT_ID = "MultiViewportFrontstage";
  public static DEFAULT_NAVIGATION_WIDGET_KEY = "DefaultNavigationWidget";
  public static DEFAULT_MANIPULATION_WIDGET_KEY = "DefaultNavigationWidget";
  // Content group for all layouts
  private _contentGroup: ContentGroup;

  constructor(viewState?: ViewStateProp) {
    super();
    const connection = UiFramework.getIModelConnection();

    // Create the content group.
    this._contentGroup = new ContentGroup({
      id: "MultiViewportContentGroup",
      layout: {
        id: "TwoHalvesHorizontal",
        horizontalSplit: {
          id: "TwoHalvesHorizontalSplit",
          percentage: 0.5,
          top: 0,
          bottom: 1,
        },
      },
      contents: [
        {
          id: "MultiViewport1",
          classId: IModelViewportControl,
          applicationData: {
            viewState,
            iModelConnection: connection,
          },
        },
        {
          id: "MultiViewport2",
          classId: IModelViewportControl,
          applicationData: {
            viewState,
            iModelConnection: connection,
          },
        },
      ],
    });
  }

  /** Define the Frontstage properties */
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return (
      <Frontstage
        id={MultiViewportFrontstage.MAIN_CONTENT_ID}
        defaultTool={CoreTools.selectElementCommand}
        contentGroup={this._contentGroup}
        isInFooterMode={true}
        viewNavigationTools={
          <Zone
            widgets={[
              <Widget
                key={MultiViewportFrontstage.DEFAULT_NAVIGATION_WIDGET_KEY}
                isFreeform={true}
                element={<BasicNavigationWidget />}
              />,
            ]}
          />
        }
        bottomPanel={<StagePanel allowedZones={[7, 8, 9]} />}
      />
    );
  }
}
