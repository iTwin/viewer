/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { trackViewerMetric, viewerAI } from "./TelemetryService";

export type PerformanceMeasures =
  | "WebViewerStartup"
  | "BaseViewerStartup"
  | "IModelAppStartup";

export type PerformanceMarks =
  | "WebViewerStarting"
  | "WebViewerStarted"
  | "BaseViewerStarting"
  | "BaseViewerStarted"
  | "IModelAppStarting"
  | "IModelAppStarted";

export class Performance {
  private static _enabled: boolean;

  static get enabled() {
    return this._enabled && window.performance;
  }

  static enable(enable?: boolean) {
    this._enabled = enable ?? false;
  }

  static addPerformanceMark(markName: PerformanceMarks) {
    if (!this.enabled) {
      return;
    }
    performance.mark(markName);
  }

  static addPerformanceMeasure(
    measureName: PerformanceMeasures,
    startMark: PerformanceMarks,
    endMark: PerformanceMarks
  ) {
    if (!this.enabled) {
      return;
    }
    performance.measure(measureName, startMark, endMark);
  }

  static async logPerformanceMetric(measureName: PerformanceMeasures) {
    if (!viewerAI.initialized) {
      await viewerAI.initialize("76ebaa63-f57e-4955-aedf-43e2741724ec");
    }
    const measure = performance.getEntriesByName(measureName);
    if (measure && measure.length > 0) {
      trackViewerMetric(`iTwinViewer.${measureName}`, measure[0].duration);
    }
  }

  static async addAndLogPerformanceMeasure(
    measureName: PerformanceMeasures,
    startMark: PerformanceMarks,
    endMark: PerformanceMarks
  ) {
    if (!this.enabled) {
      return;
    }
    this.addPerformanceMeasure(measureName, startMark, endMark);
    await this.logPerformanceMetric(measureName);
  }
}
