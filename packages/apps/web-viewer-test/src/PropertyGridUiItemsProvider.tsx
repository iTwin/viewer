/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { I18N } from "@bentley/imodeljs-i18n";
import {
  AbstractWidgetProps,
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiItemsProvider
} from "@bentley/ui-abstract";
import { UiFramework } from "@bentley/ui-framework";
import { IModelConnection } from "@bentley/imodeljs-frontend";
import { PropertyGrid } from "./PropertyGrid";
import { /*PropertyGrid,*/ PropertyGridProps } from "@bentley/property-grid-react";
import * as React from "react";

/** Provides the property grid widget to zone 9 */
export class PropertyGridUiItemsProvider implements UiItemsProvider {
  public readonly id = "PropertyGridUiitemsProvider";
  public static i18n: I18N;

  private _props?: PropertyGridProps;

  constructor(props?: PropertyGridProps) {
    this._props = props;
  }

  public provideWidgets(
    _stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    _section: StagePanelSection | undefined,
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (
      stageUsage === StageUsage.General &&
      location === StagePanelLocation.Right
    ) {

      this._props

      widgets.push({
        id: "propertyGrid",
        label: "Properties",
        getWidgetContent: () => <PropertyGrid {...this._props ??
        {
          iModelConnection: UiFramework.getIModelConnection() as IModelConnection,
          projectId: UiFramework.getIModelConnection()?.contextId ?? ""
        }
        }
        />,
      });
    }

    return widgets;
  }
}
