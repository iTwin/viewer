/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { StandardContentLayouts } from "@itwin/appui-abstract";
import type { FrontstageConfig } from "@itwin/appui-react";
import { ContentGroup, IModelViewportControl } from "@itwin/appui-react";
import { FrontstageProvider } from "@itwin/appui-react";
import { UiFramework } from "@itwin/appui-react";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { IModelViewer } from "../../../components/iModel/IModelViewer.js";
import type { ViewerFrontstage } from "../../../types.js";
/* eslint-disable @typescript-eslint/no-deprecated */
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
/* eslint-disable @typescript-eslint/no-deprecated */
vi.mock("@itwin/appui-react", () => {
  return {
    UiFramework: {
      frontstages: {
        addFrontstageProvider: vi.fn(),
        getFrontstageDef: vi
          .fn()
          .mockResolvedValue({ id: "Frontstage2", frontstage: vi.fn() }),
        setActiveFrontstageDef: vi.fn().mockResolvedValue(true),
        clearFrontstageDefs: vi.fn(),
        clearFrontstageProviders: vi.fn(),
      },
    },

    FrontstageProvider: vi.fn(),
    ThemeManager: vi.fn(() => <div></div>),
    FrameworkVersion: vi.fn(() => <div></div>),
    ConfigurableUiContent: vi.fn(() => <div></div>),
    BackstageComposer: vi.fn(() => <div></div>)
  };
});
vi.mock("@itwin/appui-abstract");

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

    await React.act(async () => {
      render(<IModelViewer frontstages={frontstages} />);
    });

    expect(UiFramework.frontstages.addFrontstageProvider).toHaveBeenCalledTimes(
      2
    );
    // expect(BackstageItemUtilities.createStageLauncher).toHaveBeenCalledTimes(2);
    await flushPromises();
    await waitFor(
      () => {
        expect(
          UiFramework.frontstages.setActiveFrontstageDef
        ).toHaveBeenCalledTimes(1);
      },
      { timeout: 10000 }
    );
  }, 10000);
});
