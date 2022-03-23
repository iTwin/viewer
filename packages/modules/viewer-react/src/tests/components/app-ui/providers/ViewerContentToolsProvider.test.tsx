/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ViewerContentToolsProvider } from "../../../../components/app-ui/providers";

describe("ViewerContentToolsProvider", () => {
  it("should return a 'section clear button' in status bar if default is not provided", () => {
    let provider = new ViewerContentToolsProvider();
    expect(provider.provideStatusBarItems().length).toBe(1);
    provider = new ViewerContentToolsProvider({ horizontal: {} });
    expect(provider.provideStatusBarItems().length).toBe(1);
  });
  it("should not modify the status bar if section group is falsy", () => {
    let provider = new ViewerContentToolsProvider({
      vertical: { sectionGroup: false },
    });
    expect(provider.provideStatusBarItems().length).toBe(0);
    provider = new ViewerContentToolsProvider({
      vertical: { sectionGroup: undefined },
    });
    expect(provider.provideStatusBarItems().length).toBe(0);
  });
});
