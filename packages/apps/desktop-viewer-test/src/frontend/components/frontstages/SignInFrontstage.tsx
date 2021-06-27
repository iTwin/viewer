/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { isFrontendAuthorizationClient } from "@bentley/frontend-authorization-client";
import { IModelApp } from "@bentley/imodeljs-frontend";
import {
  BackstageAppButton,
  ConfigurableCreateInfo,
  ContentControl,
  ContentGroup,
  ContentLayoutDef,
  CoreTools,
  Frontstage,
  FrontstageManager,
  FrontstageProps,
  FrontstageProvider,
  SignIn,
  ToolWidgetComposer,
  Widget,
  Zone,
} from "@bentley/ui-framework";
import * as React from "react";

class SignInControl extends ContentControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    const client = IModelApp.authorizationClient;
    if (isFrontendAuthorizationClient(client)) {
      this.reactNode = (
        <SignIn onOffline={this._onWorkOffline} onRegister={this._onRegister} />
      );
    } else {
      this.reactNode = null;
    }
  }

  // user chose to work offline from the sign in page
  private _onWorkOffline = async () => {
    const frontstageDef =
      FrontstageManager.findFrontstageDef("SnapshotSelector");
    await FrontstageManager.setActiveFrontstageDef(frontstageDef);
  };

  private _onRegister = () => {
    window.open("https://developer.bentley.com/register/", "_blank");
  };
}

export class SignInFrontstage extends FrontstageProvider {
  // Content layout for content views
  private _contentLayoutDef: ContentLayoutDef;

  constructor() {
    super();

    // Create the content layouts.
    this._contentLayoutDef = new ContentLayoutDef({});
  }

  public get frontstage(): React.ReactElement<FrontstageProps> {
    const contentGroup: ContentGroup = new ContentGroup({
      contents: [
        {
          classId: SignInControl,
        },
      ],
    });

    return (
      <Frontstage
        id="SignIn"
        defaultTool={CoreTools.selectElementCommand}
        defaultLayout={this._contentLayoutDef}
        contentGroup={contentGroup}
        isInFooterMode={false}
        contentManipulationTools={
          <Zone
            widgets={[
              <Widget
                key={"SignInFronstageBackstageButton"}
                isFreeform={true}
                element={
                  <ToolWidgetComposer cornerItem={<BackstageAppButton />} />
                }
              />,
            ]}
          />
        }
      />
    );
  }
}
