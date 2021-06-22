/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  Button,
  ButtonSize,
  ButtonType,
  FillCentered,
  Headline,
} from "@bentley/ui-core";
import {
  BackstageAppButton,
  ConfigurableCreateInfo,
  ContentControl,
  ContentGroup,
  ContentLayoutDef,
  CoreTools,
  Frontstage,
  FrontstageProps,
  FrontstageProvider,
  ToolWidgetComposer,
  Widget,
  Zone,
} from "@bentley/ui-framework";
import { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import * as React from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";

/* eslint-disable react/jsx-key */

class SnapshotSelectControl extends ContentControl {
  constructor(info: ConfigurableCreateInfo, options: any) {
    super(info, options);

    this.reactNode = <LocalFilePage />;
  }
}

/** SnapshotSelectFrontstage displays the file open picker. */
export class SnapshotSelectFrontstage extends FrontstageProvider {
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
          classId: SnapshotSelectControl,
        },
      ],
    });

    return (
      <Frontstage
        id="SnapshotSelector"
        defaultTool={CoreTools.selectElementCommand}
        defaultLayout={this._contentLayoutDef}
        contentGroup={contentGroup}
        isInFooterMode={false}
        contentManipulationTools={
          <Zone
            widgets={[
              <Widget
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

/** LocalFilePage displays the file picker. */
class LocalFilePage extends React.Component {
  private _clickInput = async () => {
    const options: OpenDialogOptions = {
      title: ITwinViewerApp.translate("snapshotSelect.open"),
      properties: ["openFile"],
      filters: [{ name: "iModels", extensions: ["ibim", "bim"] }],
    };

    const val = (await ITwinViewerApp.callBackend(
      "openFile",
      options
    )) as OpenDialogReturnValue;
    const file = val.canceled ? undefined : val.filePaths[0];
    if (file) {
      try {
        ITwinViewerApp.store.dispatch({
          type: "App:OPEN_SNAPSHOT",
          payload: file,
        });
      } catch (e) {}
    }
  };

  public render() {
    const title = ITwinViewerApp.translate("snapshotSelect.title");
    const buttonLabel = ITwinViewerApp.translate("snapshotSelect.open");
    return (
      <>
        <div style={{ position: "absolute", top: "16px", left: "100px" }}>
          <Headline>{title}</Headline>
        </div>
        <FillCentered>
          <Button
            size={ButtonSize.Large}
            buttonType={ButtonType.Primary}
            onClick={this._clickInput}
          >
            {buttonLabel}
          </Button>
        </FillCentered>
      </>
    );
  }
}
