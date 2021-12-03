/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./IModelMergeStatusBarItem.scss";

import { InternetConnectivityStatus } from "@bentley/imodeljs-common";
import {
  BriefcaseConnection,
  IModelApp,
  IModelConnection,
} from "@bentley/imodeljs-frontend";
import {
  CommonStatusBarItem,
  StageUsage,
  StatusBarSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import { StatusBarItemUtilities } from "@bentley/ui-framework";
import {
  getBriefcaseStatus,
  ModelStatus,
  useAccessToken,
  useConnectivity,
  useIsMounted,
} from "@itwin/desktop-viewer-react";
import { SvgUser } from "@itwin/itwinui-icons-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { BriefcaseStatus } from "../components/modelSelector";

const MergeStatusBarItem = () => {
  const [mergeStatus, setMergeStatus] = useState<ModelStatus>();
  const [connection, setConnection] = useState<BriefcaseConnection>();
  const accessToken = useAccessToken();
  const connectivityStatus = useConnectivity();
  const iModelConnection = useSelector((state: any) => {
    return state?.frameworkState?.sessionState?.iModelConnection;
  }) as IModelConnection | undefined;
  const isMounted = useIsMounted();

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
        if (isMounted.current) {
          setMergeStatus(ModelStatus.UPTODATE);
          IModelApp.viewManager.refreshForModifiedModels(undefined);
        }
      } catch (error) {
        console.error(error);
        setMergeStatus(ModelStatus.ERROR);
      }
    }
  }, [connection, isMounted]);

  useEffect(() => {
    if (mergeStatus === ModelStatus.MERGING) {
      void getLatestChangesets();
    }
  }, [mergeStatus]);

  useEffect(() => {
    if (connectivityStatus === InternetConnectivityStatus.Offline) {
      return;
    }

    if (accessToken && connection) {
      // temporarily show a spinner while querying
      setMergeStatus(ModelStatus.COMPARING);
      void getBriefcaseStatus(connection).then((status) => {
        if (isMounted.current) {
          setMergeStatus(status);
        }
      });
    }
  }, [accessToken, connectivityStatus, connection, isMounted]);

  useEffect(() => {
    if (isMounted.current) {
      if (iModelConnection?.isSnapshot) {
        setConnection(undefined);
        setMergeStatus(ModelStatus.SNAPSHOT);
      } else if (
        iModelConnection?.isBriefcase &&
        iModelConnection?.contextId &&
        iModelConnection.iModelId
      ) {
        setConnection(iModelConnection as BriefcaseConnection);
      }
    }
  }, [iModelConnection, isMounted]);

  if (!accessToken && mergeStatus !== ModelStatus.SNAPSHOT) {
    return (
      <div title="Click to login and view the model's status">
        <SvgUser
          onClick={onLoginClick}
          className="model-status actionable status-bar-status"
        />
      </div>
    );
  }
  return (
    <BriefcaseStatus
      mergeStatus={mergeStatus}
      onMergeClick={onMergeClick}
      className={"status-bar-status"}
    />
  );
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
