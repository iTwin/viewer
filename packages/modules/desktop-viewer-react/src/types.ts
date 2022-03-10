/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { FileViewerProps, ViewerCommonProps } from "@itwin/viewer-react";

export type DesktopViewerProps = Omit<FileViewerProps, "appInsightsKey"> &
  ViewerCommonProps;

export enum ModelStatus {
  ONLINE,
  OUTDATED,
  DOWNLOADING,
  MERGING,
  ERROR,
  UPTODATE,
  SNAPSHOT,
  COMPARING,
}

export interface ProgressInfo {
  percent?: number;
  total?: number;
  loaded: number;
}
