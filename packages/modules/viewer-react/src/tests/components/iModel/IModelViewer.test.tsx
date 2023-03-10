/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StandardContentLayouts } from "@itwin/appui-abstract";
import type { FrontstageConfig } from "@itwin/appui-react";
import { ContentGroup, IModelViewportControl } from "@itwin/appui-react";
import { FrontstageProvider } from "@itwin/appui-react";
import { UiFramework } from "@itwin/appui-react";
import { render } from "@testing-library/react";
import React from "react";

import { IModelViewer } from "../../../components/iModel/IModelViewer";
import type { ViewerFrontstage } from "../../../types";

class Frontstage1Provider extends FrontstageProvider {
  frontstageConfig(): FrontstageConfig {
    const content = new ContentGroup({
      id: "content-group",
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "viewport",
          classId: IModelViewportControl,
        },
      ],
    });
    return { id: "Frontstage1", contentGroup: content, version: 1 };
  }
  public id = "Frontstage1";
  // public get frontstage(): React.ReactElement<FrontstageProps> {
  //   return <div></div>;
  // }
}

class Frontstage2Provider extends FrontstageProvider {
  frontstageConfig(): FrontstageConfig {
    const content = new ContentGroup({
      id: "content-group",
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "viewport",
          classId: IModelViewportControl,
        },
      ],
    });
    return { id: "Frontstage2", contentGroup: content, version: 1 };
  }
  public id = "Frontstage2";
}

jest.mock("@itwin/appui-react", () => {
  return {
    FrontstageManager: {
      addFrontstageProvider: jest.fn(),
      getFrontstageDef: jest
        .fn()
        .mockResolvedValue({ id: "Frontstage2", frontstage: jest.fn() }),
      setActiveFrontstageDef: jest.fn().mockResolvedValue(true),
      clearFrontstageDefs: jest.fn(),
    },
    FrontstageProvider: jest.fn(),
    ThemeManager: jest.fn(() => <div></div>),
    FrameworkVersion: jest.fn(() => <div></div>),
    ConfigurableUiContent: jest.fn(() => <div></div>),
  };
});
jest.mock("@itwin/appui-abstract");

const flushPromises = () => new Promise((res) => setTimeout(res, 0));

describe("IModelViewer", () => {
  it("loads all frontstages", async () => {
    const fs1 = new Frontstage1Provider();
    const fs2 = new Frontstage2Provider();
    const frontstages: ViewerFrontstage[] = [
      {
        provider: fs1,
      },
      {
        provider: fs2,
        default: true,
      },
    ];

    render(<IModelViewer frontstages={frontstages} backstageItems={[]} />);
    expect(UiFramework.frontstages.addFrontstageProvider).toHaveBeenCalledTimes(
      2
    );
    // expect(BackstageItemUtilities.createStageLauncher).toHaveBeenCalledTimes(2);
    await flushPromises();
    expect(
      UiFramework.frontstages.setActiveFrontstageDef
    ).toHaveBeenCalledTimes(1);
  });
});
