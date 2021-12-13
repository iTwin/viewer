/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ChangeSet } from "@bentley/imodelhub-client";
import {
  ChangeSetQuery,
  IModelBankClient,
  VersionQuery,
} from "@bentley/imodelhub-client";
import type { ChangesetIndexAndId, IModelVersion } from "@itwin/core-common";
import { BentleyError, BentleyStatus } from "@itwin/core-common";
import type { FrontendHubAccess, IModelIdArg } from "@itwin/core-frontend";

export class IModelBankFrontend implements FrontendHubAccess {
  private _hubClient: IModelBankClient;
  constructor(orchestratorUrl: string) {
    this._hubClient = new IModelBankClient(orchestratorUrl, undefined);
  }

  private async _getChangesetFromId(
    arg: IModelIdArg & { changeSetId: string }
  ): Promise<ChangesetIndexAndId> {
    const changeSets: ChangeSet[] = await this._hubClient.changeSets.get(
      arg.accessToken,
      arg.iModelId,
      new ChangeSetQuery().byId(arg.changeSetId)
    );
    if (!changeSets[0] || !changeSets[0].index || !changeSets[0].id) {
      throw new BentleyError(
        BentleyStatus.ERROR,
        `Changeset ${arg.changeSetId} not found`
      );
    }
    return { index: +changeSets[0].index, id: changeSets[0].id };
  }

  public async getLatestChangeset(
    arg: IModelIdArg
  ): Promise<ChangesetIndexAndId> {
    const changeSets: ChangeSet[] = await this._hubClient.changeSets.get(
      arg.accessToken,
      arg.iModelId,
      new ChangeSetQuery().top(1).latest()
    );
    if (!changeSets[0] || !changeSets[0].index || !changeSets[0].id) {
      return { index: 0, id: "" };
    }
    return { index: +changeSets[0].index, id: changeSets[0].id };
  }

  public async getChangesetFromVersion(
    arg: IModelIdArg & { version: IModelVersion }
  ): Promise<ChangesetIndexAndId> {
    const version = arg.version;
    if (version.isFirst) {
      return { index: 0, id: "" };
    }

    const asOfChangeSetId = version.getAsOfChangeSet();
    if (asOfChangeSetId) {
      return this._getChangesetFromId({ ...arg, changeSetId: asOfChangeSetId });
    }

    const versionName = version.getName();
    if (versionName) {
      return this.getChangesetFromNamedVersion({ ...arg, versionName });
    }

    return this.getLatestChangeset(arg);
  }

  public async getChangesetFromNamedVersion(
    arg: IModelIdArg & { versionName?: string }
  ): Promise<ChangesetIndexAndId> {
    const versionQuery = arg.versionName
      ? new VersionQuery().select("ChangeSetId").byName(arg.versionName)
      : new VersionQuery().top(1);
    const versions = await this._hubClient.versions.get(
      arg.accessToken,
      arg.iModelId,
      versionQuery
    );
    if (
      !versions[0] ||
      !versions[0].changeSetIndex ||
      !versions[0].changeSetId
    ) {
      throw new BentleyError(
        BentleyStatus.ERROR,
        `Named version ${arg.versionName ?? ""} not found`
      );
    }
    return { index: versions[0].changeSetIndex, id: versions[0].changeSetId };
  }
}
