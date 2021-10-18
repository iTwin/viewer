/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  FrontstageManager,
  FrontstageProps,
  FrontstageProvider,
} from "@itwin/appui-react";
import { render } from "@testing-library/react";
import React from "react";

import { IModelViewer } from "../../../components/iModel";
import { ViewerFrontstage } from "../../../types";

jest.mock("@itwin/appui-react");
jest.mock("@itwin/appui-abstract");
jest.mock("@microsoft/applicationinsights-react-js");

const flushPromises = () => new Promise((res) => setTimeout(res, 0));

class Frontstage1Provider extends FrontstageProvider {
  public id = "Frontstage1";
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

class Frontstage2Provider extends FrontstageProvider {
  public id = "Frontstage2";
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

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
    expect(FrontstageManager.addFrontstageProvider).toHaveBeenCalledTimes(2);
    // expect(BackstageItemUtilities.createStageLauncher).toHaveBeenCalledTimes(2);
    await flushPromises();
    expect(FrontstageManager.setActiveFrontstageDef).toHaveBeenCalledTimes(1);
  });
});
