/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import { IModelVersion, SyncMode } from "@bentley/imodeljs-common";
import { NativeApp } from "@bentley/imodeljs-frontend";
import { ProgressInfo } from "@bentley/itwin-client";
import {
  IModelFull,
  IModelGrid,
  IModelGridProps,
} from "@itwin/imodel-browser-react";
import {
  SvgDownload,
  SvgStatusError,
  SvgSync,
} from "@itwin/itwinui-icons-react";
import { ProgressRadial, TileProps, Title } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import React, { useCallback, useContext, useMemo, useState } from "react";

import { ViewerFileType } from "../../../common/ViewerConfig";
import { ITwinViewerApp } from "../../app/ITwinViewerApp";
import { SettingsContext } from "../../services/SettingsClient";
interface SelectIModelProps extends IModelGridProps {
  projectName?: string;
}

enum ModelStatus {
  ONLINE,
  LOCAL,
  DOWNLOADING,
  ERROR,
}

const useDownload = (iModelId: string, iModelName: string, iTwinId: string) => {
  const [progress, setProgress] = useState<number>();
  const userSettings = useContext(SettingsContext);

  const addRecent = useCallback(async (fileName: string) => {
    await userSettings.addRecentOffline(
      iTwinId,
      iModelId,
      fileName,
      iModelName
    );
  }, []);

  const doDownload = useCallback(async () => {
    const fileName = await ITwinViewerApp.saveBriefcase(iModelName);
    if (fileName) {
      const req = await NativeApp.requestDownloadBriefcase(
        iTwinId as string,
        iModelId,
        { syncMode: SyncMode.PullOnly, fileName },
        IModelVersion.latest(),
        async (progress: ProgressInfo) => {
          setProgress(
            progress.total
              ? (progress.loaded / progress.total) * 100
              : progress.percent
          );

          console.log(
            `Progress (${progress.loaded}/${progress.total}) -> ${
              progress.total
                ? ((progress.loaded / progress.total) * 100).toPrecision(2)
                : progress.percent
            }%`
          );
        }
      );
      await req.downloadPromise;
      await addRecent(fileName);
    }
  }, [iModelId, iModelName, iTwinId]);

  return { progress, doDownload };
};

const useProgressIndicator = (iModel: IModelFull) => {
  const userSettings = useContext(SettingsContext);
  const [status, setStatus] = useState<ModelStatus>(ModelStatus.ONLINE); //TODO check for downloads first

  const { progress, doDownload } = useDownload(
    iModel.id,
    iModel.name ?? iModel.id,
    iModel.projectId ?? ""
  );

  const startDownload = useCallback(async () => {
    try {
      setStatus(ModelStatus.DOWNLOADING);
      await doDownload();
      setStatus(ModelStatus.LOCAL);
    } catch {
      setStatus(ModelStatus.ERROR);
    }
  }, []);

  const tileProps = useMemo<Partial<TileProps>>(() => {
    // first check if the iModel has already been downloaded
    const recents = userSettings.settings.recents;
    if (recents) {
      const exists = recents.find((recent) => {
        return (
          recent.iTwinId === iModel.projectId &&
          recent.iModelId === iModel.id &&
          recent.type === ViewerFileType.LOCAL
        );
      });
      if (exists) {
        setStatus(ModelStatus.LOCAL);
      }
    }

    return {
      metadata: (
        <div
          style={{
            width: "100%",
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          {status === ModelStatus.LOCAL ? (
            <SvgSync className="model-status" />
          ) : status === ModelStatus.DOWNLOADING ? (
            <ProgressRadial
              value={progress}
              style={{
                height: "20px",
              }}
            />
          ) : status === ModelStatus.ERROR ? (
            <SvgStatusError className="model-status" />
          ) : (
            <SvgDownload className="model-status" onClick={startDownload} />
          )}
        </div>
      ),
    };
  }, [progress, status]);
  return { tileProps };
};

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
          useIndividualState={useProgressIndicator}
        />
      </div>
    </div>
  );
};
