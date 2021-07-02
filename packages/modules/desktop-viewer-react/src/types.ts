/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ViewerProps } from "@itwin/viewer-react";

export type DesktopViewerProps = Omit<ViewerProps, "appInsightsKey">;
