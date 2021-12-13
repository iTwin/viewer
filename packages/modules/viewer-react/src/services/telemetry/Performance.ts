/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { trackViewerMetric, viewerAI } from "./TelemetryService";

export type PerformanceMeasures =
  | "ViewerInitialized"
  | "BaseViewerInitialized"
  | "IModelConnected"
  | "ViewStateCreated"
  | "TileTreesLoaded";

export type PerformanceMarks =
  | "ViewerStarting"
  | "ViewerStarted"
  | "BaseViewerStarted"
  | "IModelConnection"
  | "ViewStateCreation"
  | "TilesLoaded";

export class ViewerPerformance {
  private static _enabled: boolean;

  private static _getAiKey(): string {
    switch (process.env.IMJS_URL_PREFIX) {
      case "dev-":
        return "202e4e19-0357-4b93-abb4-52d9c345384d";
      case "qa-":
        return "bc9fee8c-d537-4892-b760-750392c531be";
      default:
        return "76ebaa63-f57e-4955-aedf-43e2741724ec";
    }
  }

  private static async _logMetric(measureName: PerformanceMeasures) {
    if (!viewerAI.initialized) {
      await viewerAI.initialize(this._getAiKey());
    }
    const measure = performance.getEntriesByName(measureName);
    if (measure && measure.length > 0) {
      trackViewerMetric(`iTwinViewer.${measureName}`, measure[0].duration);
    }
  }

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

  static async addAndLogMeasure(
    measureName: PerformanceMeasures,
    startMark: PerformanceMarks,
    endMark: PerformanceMarks
  ) {
    if (!this.enabled) {
      return;
    }

    this.addMeasure(measureName, startMark, endMark);
    await this._logMetric(measureName);
  }

  static clear() {
    performance.clearMarks();
    performance.clearMeasures();
  }
}
