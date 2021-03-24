/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import React from "react";

import { ErrorBoundary } from "../../containers/ErrorBoundary";
import BrokenComponent, { ErrorMessage } from "./BrokenComponent";

const renderTest = (trigger: boolean, additionnalProps?: any) => {
  const { queryByTestId, queryByText } = render(
    <ErrorBoundary {...additionnalProps}>
      {trigger ? <BrokenComponent /> : <div>MOCK_CONTENT</div>}
    </ErrorBoundary>
  );

  return {
    errorComponent: queryByTestId("test-fallback-text"),
    content: queryByText("MOCK_CONTENT"),
  };
};

describe("ErrorBoundary.tsx Tests", () => {
  test("Should display content and no error message when no error occurs", () => {
    const { errorComponent, content } = renderTest(false);
    expect(errorComponent).toBeNull();
    expect(content).not.toBeNull();
  });

  test("Should display the error message and no content when an error occurs", () => {
    const resetConsole = mockConsole();
    const { errorComponent, content } = renderTest(true);
    expect(errorComponent?.innerHTML).toBe(ErrorMessage);
    expect(content).toBeNull();
    resetConsole();
  });

  test("Should track event using the provided eventTracker and eventTitle when an error occurs", () => {
    const eventTracker = jest.fn();
    const eventTitle = "MOCK_EVENT";
    const resetConsole = mockConsole();
    renderTest(true, { eventTracker, eventTitle });
    expect(eventTracker).toHaveBeenCalledWith(
      eventTitle,
      expect.objectContaining({ error: ErrorMessage })
    );
    resetConsole();
  });
});
