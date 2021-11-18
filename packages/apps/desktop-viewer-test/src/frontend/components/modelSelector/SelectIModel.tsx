/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import { IModelVersion, SyncMode } from "@bentley/imodeljs-common";
import {
  BriefcaseConnection,
  CheckpointConnection,
  NativeApp,
} from "@bentley/imodeljs-frontend";
import { ProgressInfo } from "@bentley/itwin-client";
import {
  IModelFull,
  IModelGrid,
  IModelGridProps,
} from "@itwin/imodel-browser-react";
import {
  SvgDownload,
  SvgStatusError,
  SvgStatusSuccess,
  SvgSync,
} from "@itwin/itwinui-icons-react";
import { ProgressRadial, TileProps, Title } from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ViewerFileType } from "../../../common/ViewerConfig";
import { ITwinViewerApp } from "../../app/ITwinViewerApp";
import { SettingsContext } from "../../services/SettingsClient";
interface SelectIModelProps extends IModelGridProps {
  projectName?: string;
}

enum ModelStatus {
  ONLINE,
  OUTDATED,
  DOWNLOADING,
  MERGING,
  ERROR,
  UPTODATE,
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
  const [briefcase, setBriefcase] = useState<BriefcaseConnection>();

  const getBriefcase = useCallback(async () => {
    // if there is a local file, open a briefcase connection and store it in state
    const recents = userSettings.settings.recents;
    if (recents) {
      const local = recents.find((recent) => {
        return (
          recent.iTwinId === iModel.projectId &&
          recent.iModelId === iModel.id &&
          recent.type === ViewerFileType.LOCAL
        );
      });
      if (local?.path) {
        const connection = await BriefcaseConnection.openFile({
          fileName: local.path,
        });
        setBriefcase(connection);
      }
    }
  }, [userSettings]);

  const isBriefcaseUpToDate = useCallback(async () => {
    // get the online version
    let hasChanges = false;
    if (iModel.projectId && briefcase) {
      const remoteConnection = await CheckpointConnection.openRemote(
        iModel.projectId,
        iModel.id,
        IModelVersion.latest()
      );
      // compare latest changeset
      hasChanges = briefcase.changeset.id !== remoteConnection.changeset.id;
      await remoteConnection.close();
    }
    if (hasChanges) {
      setStatus(ModelStatus.OUTDATED);
    } else {
      setStatus(ModelStatus.UPTODATE);
    }
  }, [briefcase]);

  const { progress, doDownload } = useDownload(
    iModel.id,
    iModel.name ?? iModel.id,
    iModel.projectId ?? ""
  );

  const getLatestChangesets = useCallback(async () => {
    if (briefcase) {
      await briefcase.pullAndMergeChanges();
    }
  }, [briefcase]);

  const startDownload = useCallback(async () => {
    try {
      setStatus(ModelStatus.DOWNLOADING);
      await doDownload();
      setStatus(ModelStatus.UPTODATE);
    } catch {
      setStatus(ModelStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    if (status === ModelStatus.MERGING) {
      getLatestChangesets()
        .then(() => {
          setStatus(ModelStatus.UPTODATE);
        })
        .catch((error) => {
          console.log(error);
          setStatus(ModelStatus.ERROR);
        });
    }
  }, [status]);

  useEffect(() => {
    void getBriefcase();
    return () => {
      if (briefcase) {
        void briefcase.close();
      }
    };
  }, []);

  useEffect(() => {
    if (briefcase) {
      void isBriefcaseUpToDate();
    }
  }, [briefcase]);

  const mergeChanges = useCallback(() => {
    setStatus(ModelStatus.MERGING);
  }, []);

  const tileProps = useMemo<Partial<TileProps>>(() => {
    return {
      metadata: (
        <div
          style={{
            width: "100%",
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          {status === ModelStatus.OUTDATED ? (
            <SvgSync className="model-status" onClick={mergeChanges} />
          ) : status === ModelStatus.DOWNLOADING ||
            status === ModelStatus.MERGING ? (
            <ProgressRadial
              indeterminate={status === ModelStatus.MERGING}
              value={progress}
              style={{
                height: "20px",
              }}
            />
          ) : status === ModelStatus.ERROR ? (
            <SvgStatusError className="model-status" />
          ) : status === ModelStatus.UPTODATE ? (
            <SvgStatusSuccess className="model-status" />
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
