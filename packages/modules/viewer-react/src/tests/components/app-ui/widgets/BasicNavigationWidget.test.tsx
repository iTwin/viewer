/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { CoreTools, ToolbarHelper } from "@bentley/ui-framework";
import { render } from "@testing-library/react";
import React from "react";

import { BasicNavigationWidget } from "../../../../components/app-ui/widgets/BasicNavigationWidget";

jest.mock("@bentley/ui-abstract");
jest.mock("@bentley/ui-framework", () => {
  return {
    BackstageAppButton: jest.fn(),
    NavigationWidgetComposer: () => null,
    ToolbarComposer: jest.fn(),
    ToolbarHelper: {
      createToolbarItemFromItemDef: jest.fn(),
    },
    CoreTools: {
      rotateViewCommand: jest.fn(),
      panViewCommand: jest.fn(),
      fitViewCommand: jest.fn(),
      windowAreaCommand: jest.fn(),
      viewUndoCommand: jest.fn(),
      viewRedoCommand: jest.fn(),
      walkViewCommand: jest.fn(),
      toggleCameraViewCommand: jest.fn(),
    },
    UiFramework: {
      getIsUiVisible: jest.fn(),
      onUiVisibilityChanged: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
  };
});

describe("BasicNavigationWidget", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("defaults all tools visible", () => {
    render(<BasicNavigationWidget />);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(8);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides all horizontal tools", () => {
    render(
      <BasicNavigationWidget config={{ hideDefaultHorizontalItems: true }} />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(2);
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides all vertical tools", () => {
    render(
      <BasicNavigationWidget config={{ hideDefaultVerticalItems: true }} />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the rotate tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          horizontalItems: {
            rotateView: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the pan tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          horizontalItems: {
            panView: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the fit view tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          horizontalItems: {
            fitView: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the window area tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          horizontalItems: {
            windowArea: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the view undo tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          horizontalItems: {
            undoView: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the view redo tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          horizontalItems: {
            redoView: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the walk tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          verticalItems: {
            walkView: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });

  it("hides the camera tool", () => {
    render(
      <BasicNavigationWidget
        config={{
          verticalItems: {
            cameraView: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.rotateViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.panViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      CoreTools.fitViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      CoreTools.windowAreaCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      CoreTools.viewUndoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      60,
      CoreTools.viewRedoCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.walkViewCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      CoreTools.toggleCameraViewCommand
    );
  });
});
