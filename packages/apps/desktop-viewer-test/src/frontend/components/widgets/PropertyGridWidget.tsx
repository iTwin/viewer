/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Orientation } from "@bentley/ui-core";
import { ConfigurableCreateInfo, WidgetControl } from "@bentley/ui-framework";
import * as React from "react";

import SimplePropertiesComponent from "../Properties";

/** A widget control for displaying the PropertyGrid React component */
export class PropertyGridWidget extends WidgetControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    if (options.iModelConnection) {
      const orientation = Orientation.Vertical;
      this.reactNode = (
        <SimplePropertiesComponent
          imodel={options.iModelConnection}
          orientation={orientation}
        />
      );
    }
  }
}
