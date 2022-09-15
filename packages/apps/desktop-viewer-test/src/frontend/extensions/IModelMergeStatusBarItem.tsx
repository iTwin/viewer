/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./IModelMergeStatusBarItem.scss";

import type {
  CommonStatusBarItem,
  UiItemsProvider,
} from "@itwin/appui-abstract";
import { StageUsage, StatusBarSection } from "@itwin/appui-abstract";
import { FooterSeparator } from "@itwin/appui-layout-react";
import {
  StatusBarItemUtilities,
  useActiveIModelConnection,
} from "@itwin/appui-react";
import { InternetConnectivityStatus } from "@itwin/core-common";
import type { BriefcaseConnection } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import {
  getBriefcaseStatus,
  ModelStatus,
  useAccessToken,
  useConnectivity,
  useIsMounted,
} from "@itwin/desktop-viewer-react";
import { ElectronRendererAuthorization } from "@itwin/electron-authorization/lib/cjs/ElectronRenderer";
import { SvgCloud, SvgOffline } from "@itwin/itwinui-icons-react";
import React, { useCallback, useEffect, useState } from "react";

import { ITwinViewerApp } from "../app/ITwinViewerApp";
import { BriefcaseStatus } from "../components/modelSelector";

const ConnectionStatusBarItem = () => {
  const accessToken = useAccessToken();
  const connectivityStatus = useConnectivity();
  const onLoginClick = async () => {
    if (
      IModelApp.authorizationClient instanceof ElectronRendererAuthorization
    ) {
      await IModelApp.authorizationClient?.signIn();
    }
  };
  return (
    <div className="status-bar-status">
      <span className="status-label">
        {ITwinViewerApp.translate("briefcaseStatusTitle.connection")}
      </span>
      {accessToken &&
      connectivityStatus === InternetConnectivityStatus.Online ? (
        <SvgCloud className="connection-status-icon" />
      ) : (
        <SvgOffline
          className="connection-status-icon actionable"
          onClick={onLoginClick}
        />
      )}
    </div>
  );
};

const MergeStatusBarItem = () => {
  const [mergeStatus, setMergeStatus] = useState<ModelStatus>();
  const [connection, setConnection] = useState<BriefcaseConnection>();
  const accessToken = useAccessToken();
  const connectivityStatus = useConnectivity();
  const iModelConnection = useActiveIModelConnection();
  const isMounted = useIsMounted();

  const onMergeClick = async () => {
    setMergeStatus(ModelStatus.MERGING);
  };

  const getLatestChangesets = useCallback(async () => {
    if (connection) {
      try {
        connection.txns.onChangesPulled.addOnce(() => {
          IModelApp.viewManager.refreshForModifiedModels(undefined);
        });
        await connection.pullChanges();
        if (isMounted.current) {
          setMergeStatus(ModelStatus.UPTODATE);
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
  }, [mergeStatus, getLatestChangesets]);

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
        iModelConnection?.iTwinId &&
        iModelConnection.iModelId
      ) {
        setConnection(iModelConnection as BriefcaseConnection);
      }
    }
  }, [iModelConnection, isMounted]);

  return mergeStatus === ModelStatus.SNAPSHOT ? null : (
    <div className="status-bar-status">
      <span className="status-label">
        {ITwinViewerApp.translate("briefcaseStatusTitle.changes")}
      </span>
      <BriefcaseStatus
        mergeStatus={mergeStatus}
        onMergeClick={onMergeClick}
        className={"status-bar-status"}
      />
    </div>
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
          "IModelMergeItemsProvider:ConnectionStatusBarItem",
          StatusBarSection.Center,
          1,
          <ConnectionStatusBarItem />
        )
      );
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "IModelMergeItemsProvider:PostIModelMergeStatusBarItem",
          StatusBarSection.Center,
          2,
          <FooterSeparator />
        )
      );
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "IModelMergeItemsProvider:IModelMergeStatusBarItem",
          StatusBarSection.Center,
          3,
          <MergeStatusBarItem />
        )
      );
    }
    return statusBarItems;
  }
}
