/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import { IModelVersion } from "@bentley/imodeljs-common";
import {
  BriefcaseConnection,
  CheckpointConnection,
} from "@bentley/imodeljs-frontend";
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

import { useDownload } from "../../hooks/useDownload";
import { SettingsContext } from "../../services/SettingsClient";
import { IModelContext } from "../routes";

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

const useProgressIndicator = (iModel: IModelFull) => {
  const userSettings = useContext(SettingsContext);
  const [status, setStatus] = useState<ModelStatus>(ModelStatus.ONLINE);
  const [briefcase, setBriefcase] = useState<BriefcaseConnection>();
  const modelContext = useContext(IModelContext);
  const navigate = useNavigate();

  /**
   * Get the local file from settings
   * @returns
   */
  const getLocal = useCallback(() => {
    const recents = userSettings.settings.recents;
    if (recents) {
      return recents.find((recent) => {
        return (
          recent.iTwinId === iModel.projectId && recent.iModelId === iModel.id
        );
      });
    }
  }, [userSettings]);

  const getBriefcase = useCallback(async () => {
    // if there is a local file, open a briefcase connection and store it in state
    const local = getLocal();
    if (local?.path) {
      const connection = await BriefcaseConnection.openFile({
        fileName: local.path,
      });
      setBriefcase(connection);
    }
  }, []);

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
      const fileName = await doDownload();
      if (fileName) {
        setStatus(ModelStatus.UPTODATE);
      } else {
        setStatus(ModelStatus.ONLINE);
      }
      return fileName;
    } catch {
      setStatus(ModelStatus.ERROR);
    }
  }, []);

  const mergeChanges = useCallback(() => {
    setStatus(ModelStatus.MERGING);
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
    if (!briefcase) {
      void getBriefcase();
    }
    return () => {
      if (briefcase) {
        void briefcase.close();
      }
    };
  }, []);

  useEffect(() => {
    if (modelContext.pendingIModel === iModel.id) {
      void startDownload().then((filePath) => {
        modelContext.setPendingIModel(undefined);
        if (filePath) {
          void navigate("/viewer", { state: { filePath } });
        }
      });
    }
  }, [modelContext.pendingIModel]);

  useEffect(() => {
    if (briefcase) {
      void isBriefcaseUpToDate();
    }
  }, [briefcase]);

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
  const modelContext = useContext(IModelContext);

  const selectIModel = async (iModel: IModelFull) => {
    if (modelContext.pendingIModel) {
      // there is already a pending selection. disallow
      return;
    }
    const recents = userSettings.settings.recents;
    if (recents) {
      const local = recents.find((recent) => {
        return (
          recent.iTwinId === iModel.projectId && recent.iModelId === iModel.id
        );
      });
      if (local?.path) {
        // already downloaded, navigate
        void navigate("/viewer", { state: { filePath: local.path } });
        return;
      }
    }
    // trigger a download/view
    modelContext.setPendingIModel(iModel.id);
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
