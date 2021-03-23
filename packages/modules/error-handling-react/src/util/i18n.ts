/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const iTwinErrorI18n = i18next.createInstance();

iTwinErrorI18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translation: {
          ErrorNoEntitlement: "You do not have permission to access this page.",
          fallbackTitle401: "401 Unauthorized",
          fallbackTitle403: "403 Forbidden",
          fallbackTitle404: "404 Page Not Found",
          fallbackTitle500: "500 Internal Server Error",
          fallbackTitle503: "503 Service Unavailable",
          fallbackTitleUnsupportedBrowser: "Unsupported Browser",
          fallbackTitleGen: "An Error Has Occurred",
          fallbackTitleDefault: "Unknown Error",
          fallbackAlt401: "401 Error SVG",
          fallbackAlt403: "403 Error SVG",
          fallbackAlt404: "404 Error SVG",
          fallbackAlt500: "500 Error SVG",
          fallbackAlt503: "503 Error SVG",
          fallbackAltUnsupportedBrowser: "Unsupported Browser SVG",
          fallbackAltGen: "Generic Error SVG",
          fallbackAltDefault: "Unknown Error SVG",
          error401: "Invalid credentials",
          error403: "Access is not permitted",
          error404: "The requested page does not exist",
          error500: "An error has occurred on the server",
          error503: "The request cannot be completed at this time",
          errorDefault: "An unknown error has occurred.",
          errorUnsupportedBrowser:
            "We do not currently support this browser. Please try again using Chrome, Firefox, Safari, or the new Microsoft Edge based on Chromium.",
          errorLoginFailed: "Login Failed",
          loginValidationFailed:
            "Login validation failed. Please clear your cookies and try again.",
          ConnectFailed: "Failed to connect to the server",
          AuthFailed: "Failed to load authorization service",
          ConfigFailed: "Bad configuration",
          MaintenanceMode:
            "Server is currently undergoing maintenance. You will be redirected once maintenance is complete.",
          GraphQl: {
            errors: {
              defaultError:
                "An error has occurred while attempting to retrieve data from the server",
              unauthorizedError: "You are not authorized to view this data",
            },
          },
        },
      },
    },
    fallbackLng: "en",
    detection: {
      order: ["querystring", "navigator", "htmlTag"],
      lookupQuerystring: "lng",
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((reason) =>
    console.error("iTwinErrorI18N initialisation failed", reason)
  );
