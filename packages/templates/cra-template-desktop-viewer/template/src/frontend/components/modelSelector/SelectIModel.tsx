/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BriefcaseConnection } from "@itwin/core-frontend";
import { getBriefcaseStatus, ModelStatus } from "@itwin/desktop-viewer-react";
import type { IModelFull, IModelGridProps } from "@itwin/imodel-browser-react";
import { IModelGrid } from "@itwin/imodel-browser-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
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
  iTwinName?: string;
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
  const getLocal = useCallback(async () => {
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
    const local = await getLocal();
    if (local?.path) {
      const connection = await BriefcaseConnection.openFile({
        fileName: local.path,
        readonly: true,
      });
      const briefcaseStatus = await getBriefcaseStatus(connection);

      if (briefcaseStatus === ModelStatus.UPTODATE) {
        await connection.close();
      } else {
        setBriefcase(connection);
      }
      setStatus(briefcaseStatus);
    } else {
      setStatus(ModelStatus.ONLINE);
    }
  }, [userSettings, iModel.id, iModel.iTwinId]);

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

  const mergeChanges = useCallback(async () => {
    setStatus(ModelStatus.MERGING);
    try {
      await doPullChanges();
      if (briefcase) {
        await briefcase.close();
      }
      setStatus(ModelStatus.UPTODATE);
    } catch (error) {
      console.error(error);
      setStatus(ModelStatus.ERROR);
    }
  }, [doPullChanges]);

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
    const downloadAndNavigate = async () => {
      if (modelContext.pendingIModel === iModel.id) {
        const filePath = await startDownload();
        modelContext.setPendingIModel(undefined);
        if (filePath) {
          void navigate("/viewer", { state: { filePath } });
        }
      }
    };

    void downloadAndNavigate();
  }, [
    modelContext.pendingIModel,
    iModel.id,
    navigate,
    startDownload,
    modelContext,
  ]);

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
  iTwinName,
}: SelectIModelProps) => {
  const navigate = useNavigate();
  const userSettings = useContext(SettingsContext);
  const modelContext = useContext(IModelContext);

  useEffect(() => {
    const getUserSettings = async () => {
      await userSettings.getUserSettings();
    };

    void getUserSettings();
  }, []);

  const selectIModel = useCallback(
    async (iModel: IModelFull) => {
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

        if (local) {
          // If there is file in recent settings, check if it exists on disk,
          // if not remove it from the recent settings
          const exists = await userSettings.checkFileExists(local);
          if (exists) {
            void navigate("/viewer", { state: { filePath: local.path } });
            return;
          }

          await userSettings.removeRecent(local);
        }
      }

      // trigger a download/view
      modelContext.setPendingIModel(iModel.id);
    },
    [modelContext, userSettings, navigate]
  );

  return (
    <>
      <PageLayout.TitleArea>
        <Text variant="title">{`iModels for ${iTwinName}`}</Text>
      </PageLayout.TitleArea>

      <IModelGrid
        accessToken={accessToken}
        iTwinId={iTwinId}
        onThumbnailClick={selectIModel}
        useIndividualState={useProgressIndicator}
      />
    </>
  );
};
