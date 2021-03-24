/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  FrontstageManager,
  FrontstageProps,
  FrontstageProvider,
} from "@bentley/ui-framework";
import { render } from "@testing-library/react";
import React from "react";

import { IModelViewer } from "../../../components/iModel";
import { ViewerFrontstage } from "../../../types";

jest.mock("@bentley/ui-framework");
jest.mock("@bentley/ui-abstract");
jest.mock("@microsoft/applicationinsights-react-js");

class Frontstage1Provider extends FrontstageProvider {
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

class Frontstage2Provider extends FrontstageProvider {
  public get frontstage(): React.ReactElement<FrontstageProps> {
    return <div></div>;
  }
}

describe("IModelViewer", () => {
  it("loads all frontstages", () => {
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
    expect(FrontstageManager.setActiveFrontstageDef).toHaveBeenCalledTimes(1);
  });
});
