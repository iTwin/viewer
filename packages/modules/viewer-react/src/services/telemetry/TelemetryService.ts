/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { RpcActivity } from "@itwin/core-common";
import type { TelemetryClient, TelemetryEvent } from "@itwin/core-telemetry";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

import { ViewerAuthorization } from "../auth";

interface UserInfo {
  sub?: string; // user id
  org?: string; // org id
}

const introspectJwtToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1])) as UserInfo;
  } catch (e) {
    return null;
  }
};

class TelemetryService implements TelemetryClient {
  private _reactPlugin: ReactPlugin;
  private _appInsights?: ApplicationInsights;
  private _initialized: boolean;

  private _configureUserContext = async (): Promise<void> => {
    if (!this._appInsights) {
      return;
    }

    this._appInsights.clearAuthenticatedUserContext();

    try {
      const accessToken = await ViewerAuthorization.client?.getAccessToken();
      if (accessToken) {
        const userInfo = introspectJwtToken(accessToken);
        if (userInfo?.sub) {
          this._appInsights.setAuthenticatedUserContext(
            userInfo.sub,
            userInfo.org,
            true
          );
        }
      }
    } catch {}
  };

  private _addAuthListeners = () => {
    ViewerAuthorization.client?.onAccessTokenChanged.addListener(() => {
      this._configureUserContext().catch((err) => {
        throw err;
      });
    });
  };

  constructor() {
    this._reactPlugin = new ReactPlugin();
    this._initialized = false;
  }

  /**
   * iModelJS Telemetry Client implementation
   */
  public postTelemetry = async (
    _requestContext: RpcActivity,
    telemetryEvent: TelemetryEvent
  ): Promise<void> => {
    const properties = telemetryEvent.getProperties();

    delete properties.eventName; // No need to duplicate this property when sending
    this._appInsights?.trackEvent({
      name: telemetryEvent.eventName,
      properties,
    });
  };

  private _telemetryInitializer = () => {
    if (
      !this._appInsights ||
      !process.env.NODE_ENV ||
      process.env.NODE_ENV === "test"
    ) {
      // Don't send any telemetry while running tests.
      return false;
    }
    return true;
  };

  initialize(appInsightsKey?: string) {
    const INSTRUMENTATION_KEY = appInsightsKey ?? "";

    this._appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: INSTRUMENTATION_KEY,
        maxBatchInterval: 0,
        disableFetchTracking: false,
        enableAutoRouteTracking: true,
        extensions: [this._reactPlugin],
      },
    });

    this._appInsights.loadAppInsights();
    this._appInsights.addTelemetryInitializer(this._telemetryInitializer);
    this._addAuthListeners();
    this._initialized = true;
  }

  get appInsights() {
    return this._appInsights;
  }

  get reactPlugin() {
    return this._reactPlugin;
  }

  get initialized() {
    return this._initialized;
  }
}

export const userAI = new TelemetryService();
export const viewerAI = new TelemetryService();

export type TelemetryEventName =
  | "iTwinViewer.Viewer.Initialized"
  | "iTwinViewer.Viewer.Load";

/**
 * Track event named `name` in ApplicationInsights.
 * `name` should be defined in @ref TelemetryEvent.
 *
 * Properties can be defined by the event.  Any values set will be visible in the
 * telemetry data in Azure.
 */
export const trackUserEvent = (
  name: TelemetryEventName,
  properties?: { [key: string]: any }
): void => {
  userAI.appInsights?.trackEvent({
    name: name,
    properties: properties,
  });
};

/**
 * Use to log a metric that is not related to any particular event.
 *
 * @param name Required - The name of the metric to track.
 */
export const trackUserMetric = (
  name: string, // The identifier of the metric
  average: number, // The average value of the metric
  sampleCount?: number, // The number of samples in the average - Default: 1
  min?: number, // The minimum value in the average - Default: average
  max?: number // The maximum value in the average - Default: average
): void => {
  userAI.appInsights?.trackMetric({
    name: name,
    average: average,
    sampleCount: sampleCount,
    min: min,
    max: max,
  });
};

/**
 * Track event named `name` in ApplicationInsights.
 * `name` should be defined in @ref TelemetryEvent.
 *
 * Properties can be defined by the event.  Any values set will be visible in the
 * telemetry data in Azure.
 */
export const trackViewerEvent = (
  name: TelemetryEventName,
  properties?: { [key: string]: any }
): void => {
  viewerAI.appInsights?.trackEvent({
    name: name,
    properties: properties,
  });
};

/**
 * Use to log a metric that is not related to any particular event.
 *
 * @param name Required - The name of the metric to track.
 */
export const trackViewerMetric = (
  name: string, // The identifier of the metric
  average: number, // The average value of the metric
  sampleCount?: number, // The number of samples in the average - Default: 1
  min?: number, // The minimum value in the average - Default: average
  max?: number // The maximum value in the average - Default: average
): void => {
  viewerAI.appInsights?.trackMetric({
    name: name,
    average: average,
    sampleCount: sampleCount,
    min: min,
    max: max,
  });
};
