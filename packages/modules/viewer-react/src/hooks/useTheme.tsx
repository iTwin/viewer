/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ColorTheme } from "@itwin/appui-react";
import { UiFramework } from "@itwin/appui-react";
import { useEffect } from "react";

export function useTheme(theme?: ColorTheme | string): void {
  useEffect(() => {
    if (theme) {
      // use the provided theme
      UiFramework.setColorTheme(theme);
    }
  }, [theme]);
}
