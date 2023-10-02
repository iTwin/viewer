/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./BriefcaseStatus.scss";

import { ModelStatus } from "@itwin/desktop-viewer-react";
import {
  SvgDownload,
  SvgStatusError,
  SvgStatusSuccess,
  SvgSync,
  SvgSyncDisabled,
} from "@itwin/itwinui-icons-react";
import { ProgressRadial } from "@itwin/itwinui-react";
import React, { useCallback } from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";

interface BriefcaseStatusProps {
  mergeStatus?: ModelStatus;
  mergeProgress?: number;
  onMergeClick?: () => any;
  onDownloadClick?: () => any;
  className?: string;
}

export const BriefcaseStatus = ({
  mergeStatus,
  mergeProgress,
  onMergeClick,
  onDownloadClick,
  className,
}: BriefcaseStatusProps) => {
  const isDownloading = !!mergeProgress && mergeProgress < 100;

  const getLocalizedTitle = useCallback(() => {
    let titleKey = "";
    switch (mergeStatus) {
      case ModelStatus.COMPARING:
        titleKey = "briefcaseStatusTitle.comparing";
        break;
      case ModelStatus.MERGING:
        titleKey = `briefcaseStatusTitle.${
          isDownloading ? "downloading" : "merging"
        }`;
        break;
      case ModelStatus.DOWNLOADING:
        titleKey = "briefcaseStatusTitle.downloading";
        break;
      case ModelStatus.OUTDATED:
        titleKey = "briefcaseStatusTitle.outdated";
        break;
      case ModelStatus.UPTODATE:
        titleKey = "briefcaseStatusTitle.upToDate";
        break;
      case ModelStatus.ERROR:
        titleKey = "briefcaseStatusTitle.error";
        break;
      case ModelStatus.ONLINE:
        titleKey = "briefcaseStatusTitle.online";
        break;
    }
    return ITwinViewerApp.translate(titleKey);
  }, [mergeStatus, isDownloading]);

  const title = getLocalizedTitle();

  const statusComponent = useCallback(() => {
    switch (mergeStatus) {
      case ModelStatus.COMPARING:
        return (
          <ProgressRadial indeterminate={true} style={{ height: "100%" }} />
        );
      case ModelStatus.MERGING:
        return (
          <ProgressRadial
            indeterminate={!isDownloading}
            value={mergeProgress}
            style={{ height: "100%", width: "20px" }}
          />
        );
      case ModelStatus.DOWNLOADING:
        return (
          <ProgressRadial
            indeterminate={false}
            value={mergeProgress}
            style={{ height: "100%", width: "20px" }}
          />
        );
      case ModelStatus.OUTDATED:
        return <SvgSync onClick={onMergeClick} cursor={"pointer"} />;
      case ModelStatus.UPTODATE:
        return <SvgStatusSuccess />;
      case ModelStatus.ERROR:
        return <SvgStatusError />;
      case ModelStatus.ONLINE:
        return <SvgDownload onClick={onDownloadClick} cursor={"pointer"} />;
      default:
        return <SvgSyncDisabled />;
    }
  }, [
    mergeStatus,
    mergeProgress,
    isDownloading,
    onMergeClick,
    onDownloadClick,
  ]);

  return (
    <div
      title={title}
      className={className ? `${className} model-status` : "model-status"}
    >
      {statusComponent()}
    </div>
  );
};
