/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { i18n } from "i18next";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { FallbackUi as FallbackComponent } from "../components/fallback/FallbackUi";
import svg401 from "../images/svgs/401-9ZUI-WEB.svg";
import svg403 from "../images/svgs/403-9ZUI-WEB.svg";
import svg404 from "../images/svgs/404-WEB.svg";
import svg500 from "../images/svgs/500-WEB.svg";
import svg503 from "../images/svgs/503-WEB.svg";
import svgGen from "../images/svgs/Generic-WEB.svg";
import { EventTrackerFunction } from "../types";
import { iTwinErrorI18n } from "../util/i18n";

export type FallbackKnownMessages =
  | "error401"
  | "error403"
  | "error404"
  | "error500"
  | "error503"
  | "errorUnsupportedBrowser"
  | "ErrorNoEntitlement"
  | "ConnectFailed"
  | "ConfigFailed"
  | "MaintenanceMode"
  | "AuthFailed"
  | "errorDefault";
interface FallbackProps<T> {
  translate?: boolean; // Translate flag
  message?: FallbackKnownMessages | string; // Text to display
  className?: string; // optional css class to override container styles
  eventTracker?: EventTrackerFunction<T>;
  eventTitle?: T;
  withHelmet?: boolean;
  alternateI18n?: i18n;
}

export const Fallback: <T>(props: FallbackProps<T>) => JSX.Element = ({
  translate = true,
  message,
  className,
  eventTracker: trackEvent,
  eventTitle,
  withHelmet,
  alternateI18n,
}) => {
  const { t } = useTranslation(undefined, { i18n: iTwinErrorI18n });
  const { t: alternateT } = useTranslation(undefined, { i18n: alternateI18n });
  useEffect(() => {
    if ((trackEvent && !eventTitle) || (!trackEvent && eventTitle)) {
      console.warn(
        "itwin-error-handling-react Fallback: Both trackEvent and eventTitle must be provided for tracking to occur, remove both if no tracking is wanted."
      );
    }
  }, [trackEvent, eventTitle]);
  let src = svgGen;
  let alt = "Generic Error SVG";
  let title = "An Error Has Occurred";
  let text = "";

  if (message) {
    if (translate && iTwinErrorI18n.exists(message)) {
      title = t("fallbackTitleGen");
      alt = t("fallbackAltGen");
      text = t(message);

      switch (message) {
        case "error401":
          title = t("fallbackTitle401");
          alt = t("fallbackAlt401");
          src = svg401;
          break;
        case "error403":
        case "ErrorNoEntitlement":
          title = t("fallbackTitle403");
          alt = t("fallbackAlt403");
          src = svg403;
          break;
        case "error404":
          title = t("fallbackTitle404");
          alt = t("fallbackAlt404");
          src = svg404;
          break;
        case "error500":
          title = t("fallbackTitle500");
          alt = t("fallbackAlt500");
          src = svg500;
          break;
        case "error503":
        case "ConnectFailed":
          title = t("fallbackTitle503");
          alt = t("fallbackAlt503");
          src = svg503;
          break;
        case "MaintenanceMode":
          title = t("fallbackTitle503");
          alt = t("fallbackAlt503");
          src = svg503;
          break;
        case "errorUnsupportedBrowser":
          title = t("fallbackTitleUnsupportedBrowser");
          alt = t("fallbackAltUnsupportedBrowser");
          break;
        case "errorLoginFailed":
          title = t("errorLoginFailed");
          text = t("loginValidationFailed");
          break;
        default:
          title = t("fallbackTitleDefault");
          alt = t("fallbackAltDefault");
          src = svg404;
          text = t("errorDefault");
          message = "errorDefault";
          break;
      }
    } else if (translate && alternateI18n?.exists(message)) {
      title = t("fallbackTitleGen");
      alt = t("fallbackAltGen");
      text = alternateT(message);
    } else {
      text = message;
    }
    if (trackEvent && eventTitle) {
      trackEvent(eventTitle, { error: message });
    }
  }

  return (
    <FallbackComponent
      text={text}
      title={title}
      imageSource={src}
      imageAlt={alt}
      className={className}
      withHelmet={withHelmet}
    />
  );
};
