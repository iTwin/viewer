/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import "./IModelMergeStatusBarItem.scss";

import {
  IModelVersion,
  InternetConnectivityStatus,
} from "@bentley/imodeljs-common";
import {
  BriefcaseConnection,
  CheckpointConnection,
  IModelApp,
} from "@bentley/imodeljs-frontend";
import {
  CommonStatusBarItem,
  StageUsage,
  StatusBarSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import { StatusBarItemUtilities, UiFramework } from "@bentley/ui-framework";
import { ModelStatus, useConnectivity } from "@itwin/desktop-viewer-react";
import { useAccessToken } from "@itwin/desktop-viewer-react";
import {
  SvgStatusError,
  SvgStatusSuccess,
  SvgSync,
  SvgUser,
} from "@itwin/itwinui-icons-react";
import { ProgressRadial } from "@itwin/itwinui-react";
import React, { useCallback, useEffect, useState } from "react";

const MergeStatusBarItem = () => {
  const [mergeStatus, setMergeStatus] = useState<ModelStatus>();
  const [connection, setConnection] = useState<BriefcaseConnection>();
  const accessToken = useAccessToken();
  const connectivityStatus = useConnectivity();

  const onMergeClick = async () => {
    setMergeStatus(ModelStatus.MERGING);
  };

  const onLoginClick = async () => {
    await IModelApp.authorizationClient?.signIn();
  };

  const getLatestChangesets = useCallback(async () => {
    if (connection) {
      try {
        await connection.pullAndMergeChanges();
        setMergeStatus(ModelStatus.UPTODATE);
        IModelApp.viewManager.refreshForModifiedModels(undefined);
      } catch (error) {
        console.error(error);
        setMergeStatus(ModelStatus.ERROR);
      }
    }
  }, [connection]);

  useEffect(() => {
    if (mergeStatus === ModelStatus.MERGING) {
      void getLatestChangesets();
    }
  }, [mergeStatus]);

  useEffect(() => {
    if (connectivityStatus === InternetConnectivityStatus.Offline) {
      return;
    }
    const iModel = UiFramework.getIModelConnection();
    if (iModel?.isSnapshot) {
      setMergeStatus(ModelStatus.SNAPSHOT);
      return;
    } else if (iModel?.isBriefcase && iModel?.contextId && iModel.iModelId) {
      if (accessToken) {
        setConnection(iModel as BriefcaseConnection);
        // temporarily show a spinner while querying
        setMergeStatus(ModelStatus.COMPARING);
        void CheckpointConnection.openRemote(
          iModel.contextId,
          iModel.iModelId,
          IModelVersion.latest()
        )
          .then((remoteConnection) => {
            // compare latest changeset
            const hasChanges =
              iModel.changeset.id !== remoteConnection.changeset.id;
            if (hasChanges) {
              setMergeStatus(ModelStatus.OUTDATED);
            } else {
              setMergeStatus(ModelStatus.UPTODATE);
            }
            void remoteConnection.close();
          })
          .catch((err) => {
            console.error(err);
            setMergeStatus(ModelStatus.ERROR);
          });
      }
    }
  }, [accessToken, connectivityStatus]);

  if (!accessToken) {
    return (
      <div title="Click to login and view the model's status">
        <SvgUser onClick={onLoginClick} className="model-status actionable" />
      </div>
    );
  }
  switch (mergeStatus) {
    case ModelStatus.COMPARING:
      return (
        <div title="Checking for changes...">
          <ProgressRadial indeterminate={true} className="model-status" />;
        </div>
      );
    case ModelStatus.MERGING:
      return (
        <div title="Pulling changes...">
          <ProgressRadial indeterminate={true} className="model-status" />;
        </div>
      );
    case ModelStatus.OUTDATED:
      return (
        <div title="Click to pull upstream changes">
          <SvgSync onClick={onMergeClick} className="model-status actionable" />
        </div>
      );
    case ModelStatus.UPTODATE:
      return (
        <div title="Up to date">
          <SvgStatusSuccess className="model-status" />
        </div>
      );
    case ModelStatus.ERROR:
      return <SvgStatusError className="model-status" />;
    default:
      // should only be snapshots, in which case we don't want to show the item
      return null;
  }
};

export class IModelMergeItemsProvider implements UiItemsProvider {
  public readonly id = "IModelMergeItemsProvider";

  public provideStatusBarItems(
    _stageId: string,
    stageUsage: string
  ): CommonStatusBarItem[] {
    const statusBarItems: CommonStatusBarItem[] = [];
    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "IModelMergeItemsProvider:IModelMergeStatusBarItem",
          StatusBarSection.Right,
          10000,
          <MergeStatusBarItem />
        )
      );
    }
    return statusBarItems;
  }
}
