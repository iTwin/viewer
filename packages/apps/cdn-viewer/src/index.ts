/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ItwinViewer } from "@itwin/web-viewer-react";

/**
 * get the viewer root url from the script tag
 */
const script = document.querySelector(
  'script[src$="static/js/itwin-viewer-react.js"]'
) as HTMLScriptElement;

if (script) {
  // host assets from here
  (window as any).ITWIN_VIEWER_HOME = script.src.substr(
    0,
    script.src.indexOf("/static/js")
  );
}

/** add the class to the window for global access */
(window as any).iTwinViewer = ItwinViewer;
