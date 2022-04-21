/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

export type PerformanceMeasures =
  | "ViewerInitialized"
  | "BaseViewerInitialized"
  | "IModelConnecting"
  | "IModelConnected"
  | "ViewStateCreated"
  | "TileTreesLoaded";

export type PerformanceMarks =
  | "ViewerStarting"
  | "ViewerStarted"
  | "BaseViewerStarted"
  | "IModelConnectionStarted"
  | "IModelConnection"
  | "ViewStateCreation"
  | "TilesLoaded";

export class ViewerPerformance {
  private static _enabled: boolean;

  static get enabled() {
    return this._enabled && window.performance;
  }

  static enable(enable?: boolean) {
    this._enabled = enable ?? false;
  }

  static addMark(markName: PerformanceMarks) {
    if (!this.enabled) {
      return;
    }
    performance.mark(markName);
  }

  static addMeasure(
    measureName: PerformanceMeasures,
    startMark: PerformanceMarks,
    endMark: PerformanceMarks
  ) {
    if (!this.enabled) {
      return;
    }
    if (
      performance.getEntriesByName(startMark).length > 0 &&
      performance.getEntriesByName(endMark).length > 0
    ) {
      performance.measure(measureName, startMark, endMark);
    }
  }

  static clear() {
    performance.clearMarks();
    performance.clearMeasures();
  }
}
