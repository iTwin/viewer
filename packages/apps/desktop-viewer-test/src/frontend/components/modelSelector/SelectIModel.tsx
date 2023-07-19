/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectIModel.scss";

import { BriefcaseConnection } from "@itwin/core-frontend";
import { getBriefcaseStatus, ModelStatus } from "@itwin/desktop-viewer-react";
import type { IModelFull, IModelGridProps } from "@itwin/imodel-browser-react";
import { IModelGrid } from "@itwin/imodel-browser-react";
import type { TileProps } from "@itwin/itwinui-react";
import { Text } from "@itwin/itwinui-react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useDownload } from "../../hooks/useDownload";
import { usePullChanges } from "../../hooks/usePullChanges";
import { SettingsContext } from "../../services/SettingsClient";
import { IModelContext } from "../routes";
import { BriefcaseStatus } from "./BriefcaseStatus";

interface SelectIModelProps extends IModelGridProps {
  projectName?: string;
}

const useProgressIndicator = (iModel: IModelFull) => {
  const userSettings = useContext(SettingsContext);
  const [status, setStatus] = useState<ModelStatus>();
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
          recent.iTwinId === iModel.iTwinId && recent.iModelId === iModel.id
        );
      });
    }
  }, [userSettings, iModel.id, iModel.iTwinId]);

  const getBriefcase = useCallback(async () => {
    // if there is a local file, open a briefcase connection and store it in state
    const local = getLocal();
    if (local?.path) {
      const connection = await BriefcaseConnection.openFile({
        fileName: local.path,
        readonly: true,
      });
      setBriefcase(connection);
    } else {
      setStatus(ModelStatus.ONLINE);
    }
  }, [getLocal]);

  const { progress, doDownload } = useDownload(
    iModel.id,
    iModel.name ?? iModel.id,
    iModel.iTwinId ?? ""
  );

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
    } catch (error) {
      console.log(error);
      setStatus(ModelStatus.ERROR);
    }
  }, [doDownload]);

  const { pullProgress, doPullChanges } = usePullChanges(briefcase);

  const mergeChanges = useCallback(() => {
    setStatus(ModelStatus.MERGING);
  }, []);

  useEffect(() => {
    if (status === ModelStatus.MERGING) {
      doPullChanges()
        .then(() => {
          setStatus(ModelStatus.UPTODATE);
        })
        .catch((error) => {
          console.error(error);
          setStatus(ModelStatus.ERROR);
        });
    }
  }, [status, doPullChanges]);

  useEffect(() => {
    if (!briefcase) {
      void getBriefcase();
    }
    return () => {
      if (briefcase) {
        void briefcase.close();
      }
    };
  }, [briefcase, getBriefcase]);

  useEffect(() => {
    if (modelContext.pendingIModel === iModel.id) {
      void startDownload().then((filePath) => {
        modelContext.setPendingIModel(undefined);
        if (filePath) {
          void navigate("/viewer", { state: { filePath } });
        }
      });
    }
  }, [
    modelContext.pendingIModel,
    iModel.id,
    navigate,
    startDownload,
    modelContext,
  ]);

  useEffect(() => {
    if (briefcase) {
      void getBriefcaseStatus(briefcase).then((briefcaseStatus) => {
        setStatus(briefcaseStatus);
      });
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
          <BriefcaseStatus
            mergeStatus={status}
            mergeProgress={pullProgress ?? progress}
            onMergeClick={mergeChanges}
            onDownloadClick={startDownload}
          />
        </div>
      ),
    };
  }, [progress, pullProgress, status, mergeChanges, startDownload]);
  return { tileProps };
};

export const SelectIModel = ({
  accessToken,
  iTwinId,
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
          recent.iTwinId === iModel.iTwinId && recent.iModelId === iModel.id
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
        <Text variant="title">{`iModels for ${projectName}`}</Text>
      </div>
      <div className="itv-scrolling-content">
        <IModelGrid
          accessToken={accessToken}
          onThumbnailClick={selectIModel}
          useIndividualState={useProgressIndicator}
        />
      </div>
    </div>
  );
};
