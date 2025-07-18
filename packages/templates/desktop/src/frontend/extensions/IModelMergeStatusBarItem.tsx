/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./IModelMergeStatusBarItem.scss";

import {
  StageUsage,
  type StatusBarItem,
  StatusBarItemUtilities,
  StatusBarSection,
  type UiItemsProvider,
  useActiveIModelConnection
} from "@itwin/appui-react";
import { InternetConnectivityStatus } from "@itwin/core-common";
import { type BriefcaseConnection, IModelApp } from "@itwin/core-frontend";
import {
  getBriefcaseStatus,
  ModelStatus,
  useAccessToken,
  useConnectivity,
  useIsMounted,
} from "@itwin/desktop-viewer-react";
import { SvgCloud, SvgOffline } from "@itwin/itwinui-icons-react";
import { useCallback, useEffect, useState } from "react";

import { ITwinViewerApp } from "../app/ITwinViewerApp";
import { BriefcaseStatus } from "../components/modelSelector";
import { usePullChanges } from "../hooks/usePullChanges";
import { isElectronRendererAuth } from "../util/typeCheck";

const ConnectionStatusBarItem = () => {
  const accessToken = useAccessToken();
  const connectivityStatus = useConnectivity();
  const onLoginClick = useCallback(async () => {
    if (
      isElectronRendererAuth(IModelApp.authorizationClient)
    ) {
      await IModelApp.authorizationClient?.signIn();
    }
  }, []);
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

  const { pullProgress, doPullChanges } = usePullChanges(connection);

  useEffect(() => {
    const rmListener = connection?.txns.onChangesPulled.addListener(() => {
      IModelApp.viewManager.refreshForModifiedModels(undefined);
    });
    return () => rmListener?.();
  }, [connection]);

  const getLatestChangesets = useCallback(async () => {
    try {
      await doPullChanges();
      if (isMounted.current) {
        setMergeStatus(ModelStatus.UPTODATE);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setMergeStatus(ModelStatus.ERROR);
    }
  }, [doPullChanges, isMounted]);

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
  }, [connectivityStatus, accessToken, connection, isMounted]);

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
        mergeProgress={pullProgress}
        onMergeClick={() => {
          setMergeStatus(ModelStatus.MERGING);
        }}
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
  ): StatusBarItem[] {
    const statusBarItems: StatusBarItem[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        StatusBarItemUtilities.createCustomItem({
          id: "IModelMergeItemsProvider:ConnectionStatusBarItem",
          section: StatusBarSection.Center,
          itemPriority: 1,
          content: <ConnectionStatusBarItem />
        })
      );
      statusBarItems.push(
        StatusBarItemUtilities.createCustomItem({
          id: "IModelMergeItemsProvider:IModelMergeStatusBarItem",
          section: StatusBarSection.Center,
          itemPriority: 3,
          content: <MergeStatusBarItem />
        })
      );
    }
    return statusBarItems;
  }
}
