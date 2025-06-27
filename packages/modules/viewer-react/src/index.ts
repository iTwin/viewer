/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./typings/global.js";
globalThis.IMJS_URL_PREFIX ??= ""; // default to prod

export * from "./components/BaseViewer.js";
export * from "./services/BaseInitializer.js";
export * from "./services/iModel/index.js";
export * from "./utilities/index.js";
export * from "./types.js";
export * from "./hooks/index.js";
export * from "./services/auth/index.js";
export * from "./services/telemetry/index.js";
export * from "./components/app-ui/providers/index.js";
