/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import { IModelVersion, SyncMode } from "@bentley/imodeljs-common";
import { BriefcaseConnection, NativeApp } from "@bentley/imodeljs-frontend";
import { ProgressInfo } from "@bentley/itwin-client";
import {
  IModelFull,
  IModelGrid,
  IModelGridProps,
} from "@itwin/imodel-browser-react";
import { Title } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import React, { useContext } from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";
import { SettingsContext } from "../../services/SettingsClient";
interface SelectIModelProps extends IModelGridProps {
  projectName?: string;
}

export const SelectIModel = ({
  accessToken,
  projectId,
  projectName,
}: SelectIModelProps) => {
  const navigate = useNavigate();
  const userSettings = useContext(SettingsContext);

  const selectIModel = async (iModel: IModelFull) => {
    if (projectId) {
      void userSettings.addRecentOnline(projectId, iModel.id, iModel.name);
    }
    await navigate(`${projectId}/${iModel.id}`);
  };

  // TODO Kevin
  const iModelActions = [
    {
      key: "download", //TODO localize,
      children: "Download",
      visible: () => true,
      onClick: async (iModel: IModelFull) => {
        // TODO get filename
        const fileName = await ITwinViewerApp.saveBriefcase();
        const req = await NativeApp.requestDownloadBriefcase(
          iModel.projectId as string,
          iModel.id,
          { syncMode: SyncMode.PullOnly, fileName },
          IModelVersion.latest(),
          async (progress: ProgressInfo) => {
            // eslint-disable-next-line no-console
            console.log(
              `Progress (${progress.loaded}/${progress.total}) -> ${progress.percent}%`
            );
          }
        );
        await req.downloadPromise;
        const iModelConnection = await BriefcaseConnection.openFile({
          fileName: req.fileName,
          readonly: true,
        });
      },
    },
  ];

  return (
    <div className="itv-scrolling-container select-imodel">
      <div className={"itv-content-margins"}>
        <Title>{`iModels for ${projectName}`}</Title>
      </div>
      <div className="itv-scrolling-content">
        <IModelGrid
          accessToken={accessToken}
          projectId={projectId}
          onThumbnailClick={selectIModel}
          iModelActions={iModelActions}
        />
      </div>
    </div>
  );
};
