/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  CoreTools,
  SelectionContextToolDefinitions,
  ToolbarHelper,
} from "@itwin/appui-react";
import { render } from "@testing-library/react";
import React from "react";

import { BasicToolWidget } from "../../../../components/app-ui/widgets/BasicToolWidget";

jest.mock("@itwin/appui-abstract");
jest.mock("@itwin/appui-react", () => {
  return {
    BackstageAppButton: jest.fn(),
    ToolWidgetComposer: () => null,
    ToolbarComposer: jest.fn(),
    ToolbarHelper: {
      createToolbarItemFromItemDef: jest.fn(),
    },
    CoreTools: {
      clearSelectionItemDef: jest.fn(),
      selectElementCommand: jest.fn(),
      measureToolGroup: jest.fn(),
      sectionToolGroup: jest.fn(),
    },
    SelectionContextToolDefinitions: {
      clearHideIsolateEmphasizeElementsItemDef: jest.fn(),
      hideElementsItemDef: jest.fn(),
      isolateElementsItemDef: jest.fn(),
      emphasizeElementsItemDef: jest.fn(),
    },
    UiFramework: {
      getIsUiVisible: jest.fn(),
      onUiVisibilityChanged: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
    useUiItemsProviderBackstageItems: () => [],
  };
});

jest.mock("@itwin/core-frontend");

describe("BasicToolWidget", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("defaults all tools visible", () => {
    render(<BasicToolWidget />);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(7);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides all horizontal tools", () => {
    render(<BasicToolWidget config={{ hideDefaultHorizontalItems: true }} />);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(2);
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides all vertical tools", () => {
    render(<BasicToolWidget config={{ hideDefaultVerticalItems: true }} />);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(5);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides the clear selection tool", () => {
    render(
      <BasicToolWidget
        config={{
          horizontalItems: {
            clearSelection: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides the clear hide/emphasize/isolate tool", () => {
    render(
      <BasicToolWidget
        config={{
          horizontalItems: {
            clearHideIsolateEmphasizeElements: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides the hide elements tool", () => {
    render(
      <BasicToolWidget
        config={{
          horizontalItems: {
            hideElements: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides the isolate elements tool", () => {
    render(
      <BasicToolWidget
        config={{
          horizontalItems: {
            isolateElements: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides the emphasize elements tool", () => {
    render(
      <BasicToolWidget
        config={{
          horizontalItems: {
            emphasizeElements: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides the select tool", () => {
    render(
      <BasicToolWidget
        config={{
          verticalItems: {
            selectTool: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });

  it("hides the section tools", () => {
    render(
      <BasicToolWidget
        config={{
          verticalItems: {
            sectionTools: false,
          },
        }}
      />
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledTimes(6);
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.clearSelectionItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      20,
      SelectionContextToolDefinitions.clearHideIsolateEmphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      30,
      SelectionContextToolDefinitions.hideElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      40,
      SelectionContextToolDefinitions.isolateElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      50,
      SelectionContextToolDefinitions.emphasizeElementsItemDef
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).toHaveBeenCalledWith(
      10,
      CoreTools.selectElementCommand
    );
    expect(ToolbarHelper.createToolbarItemFromItemDef).not.toHaveBeenCalledWith(
      20,
      CoreTools.sectionToolGroup
    );
  });
});
