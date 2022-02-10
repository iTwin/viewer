/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { Viewport } from "@itwin/core-frontend";
import { TwoWayViewportSync } from "@itwin/core-frontend";

/** This class implements the interaction between the sample and the iModel.js API.  No user interface. */
export default class MultiViewportApi {
  public static twoWaySync: TwoWayViewportSync = new TwoWayViewportSync();

  /** Connects the views of the two provided viewports, overriding the second parameter's view with the first's view. */
  public static connectViewports(vp1: Viewport, vp2: Viewport) {
    MultiViewportApi.twoWaySync.connect(vp1, vp2);
  }
  /** Disconnects all viewports that have been synced using this instance of [TwoWayViewportSync]. */
  public static disconnectViewports() {
    MultiViewportApi.twoWaySync.disconnect();
  }
}
