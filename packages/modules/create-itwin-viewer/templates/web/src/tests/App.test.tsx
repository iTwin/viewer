/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render } from "@testing-library/react";
import React from "react";

import App from "../App";

jest.mock("@itwin/viewer-react", () => {
  return {
    ...jest.requireActual<any>("@itwin/viewer-react"),
    ViewerPerformance: {
      addMark: jest.fn(),
      addMeasure: jest.fn(),
      enable: jest.fn(),
    },
  };
});

describe("App", () => {
  test("renders a progress bar while not authenticated", async () => {
    const component = render(<App />);
    const container = await component.findByText("Signing in...");
    expect(container).toBeInTheDocument();
  });
});
