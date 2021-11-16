/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  ChangeSet,
  ChangeSetQuery,
  IModelBankClient,
  VersionQuery,
} from "@bentley/imodelhub-client";
import {
  BentleyError,
  BentleyStatus,
  ChangesetId,
  IModelVersion,
} from "@itwin/core-common";
import { FrontendHubAccess, IModelIdArg } from "@itwin/core-frontend";

export class IModelBankFrontend implements FrontendHubAccess {
  private _hubClient: IModelBankClient;
  constructor(orchestratorUrl: string) {
    this._hubClient = new IModelBankClient(orchestratorUrl, undefined);
  }

  public async getLatestChangesetId(arg: IModelIdArg): Promise<ChangesetId> {
    const changeSets: ChangeSet[] = await this._hubClient.changeSets.get(
      arg.accessToken,
      arg.iModelId,
      new ChangeSetQuery().top(1).latest()
    );
    return changeSets.length === 0
      ? ""
      : changeSets[changeSets.length - 1].wsgId;
  }

  public async getChangesetIdFromVersion(
    arg: IModelIdArg & { version: IModelVersion }
  ): Promise<ChangesetId> {
    const version = arg.version;
    if (version.isFirst) {
      return "";
    }

    const asOf = version.getAsOfChangeSet();
    if (asOf) {
      return asOf;
    }

    const versionName = version.getName();
    if (versionName) {
      return this.getChangesetIdFromNamedVersion({ ...arg, versionName });
    }

    return this.getLatestChangesetId(arg);
  }

  public async getChangesetIdFromNamedVersion(
    arg: IModelIdArg & { versionName: string }
  ): Promise<ChangesetId> {
    const versions = await this._hubClient.versions.get(
      arg.accessToken,
      arg.iModelId,
      new VersionQuery().select("ChangeSetId").byName(arg.versionName)
    );
    if (!versions?.length || !versions[0]?.changeSetId) {
      throw new BentleyError(
        BentleyStatus.ERROR,
        `Named version ${arg.versionName} not found`
      );
    }
    return versions[0].changeSetId;
  }
}
