/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { TelemetryClient, TelemetryEvent } from "@bentley/telemetry-client";
import { RpcActivity } from "@itwin/core-common";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

import { BaseInitializer } from "../BaseInitializer";

class TelemetryService implements TelemetryClient {
  private _reactPlugin: ReactPlugin;
  private _appInsights?: ApplicationInsights;

  private _configureUserContext = async (): Promise<void> => {
    if (!this._appInsights) {
      return;
    }

    try {
      // TODO 3.0 how to get user info?
      // const token = await BaseInitializer.authClient?.
      // const accessToken =
      //   (await BaseInitializer.authClient?.getAccessToken()) as AccessToken;
      // const user = accessToken?.getAccessToken().getUserInfo();
      // if (user && accessToken) {
      //   this._appInsights.setAuthenticatedUserContext(
      //     user.id,
      //     user.organization?.id,
      //     true
      //   );
      // } else {
      //   this._appInsights.clearAuthenticatedUserContext();
      // }
    } catch {
      // Having no accessToken throws an error, but we just treat it as an unauthorized user
      this._appInsights.clearAuthenticatedUserContext();
    }
  };

  private _addAuthListeners = () => {
    BaseInitializer.authClient?.onAccessTokenChanged.addListener(() => {
      this._configureUserContext().catch((err) => {
        throw err;
      });
    });
  };

  constructor() {
    this._reactPlugin = new ReactPlugin();
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
  }

  get appInsights() {
    return this._appInsights;
  }

  get reactPlugin() {
    return this._reactPlugin;
  }
}

export const ai = new TelemetryService();

export type TelemetryMetricName = ""; // Add metric names here.

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
export const trackEvent = (
  name: TelemetryEventName,
  properties?: { [key: string]: any }
): void => {
  ai.appInsights?.trackEvent({
    name: name,
    properties: properties,
  });
};

/**
 * Use to log a metric that is not related to any particular event.
 *
 * @param name Required - The name of the metric to track.
 */
export const trackMetric = (
  name: TelemetryMetricName, // The identifier of the metric
  average: number, // The average value of the metric
  sampleCount?: number, // The number of samples in the average - Default: 1
  min?: number, // The minimum value in the average - Default: average
  max?: number // The maximum value in the average - Default: average
): void => {
  ai.appInsights?.trackMetric({
    name: name,
    average: average,
    sampleCount: sampleCount,
    min: min,
    max: max,
  });
};
