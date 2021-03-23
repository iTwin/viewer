/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  AuthorizedFrontendRequestContext,
  IModelApp,
} from "@bentley/imodeljs-frontend";
import { SettingsStatus } from "@bentley/product-settings-client";
import {
  SessionStateActionId,
  SyncUiEventArgs,
  SyncUiEventDispatcher,
  UiFramework,
} from "@bentley/ui-framework";

export class SelectionScopeClient {
  public static readonly defaultScope = "top-assembly";
  public static readonly namespace = "ItwinViewer-SelectionScope";
  public static readonly settingName = "SelectionScope";

  public static setupSelectionScopeHandler(): void {
    SyncUiEventDispatcher.onSyncUiEvent.removeListener(
      SelectionScopeClient.selectionScopeChangeHandler
    );
    SyncUiEventDispatcher.onSyncUiEvent.addListener(
      SelectionScopeClient.selectionScopeChangeHandler
    );
  }

  private static async selectionScopeChangeHandler(args: SyncUiEventArgs) {
    if (args.eventIds.has(SessionStateActionId.SetSelectionScope)) {
      const context = await AuthorizedFrontendRequestContext.create();
      const setting = UiFramework.getActiveSelectionScope();
      await IModelApp.settings.saveUserSetting(
        context,
        setting,
        SelectionScopeClient.namespace,
        SelectionScopeClient.settingName,
        true
      );
    }
  }

  public static async initializeSelectionScope(): void {
    const context = await AuthorizedFrontendRequestContext.create();
    const selectionScope = await IModelApp.settings.getUserSetting(
      context,
      SelectionScopeClient.namespace,
      SelectionScopeClient.settingName,
      true
    );
    if (selectionScope.status !== SettingsStatus.Success) {
      UiFramework.setActiveSelectionScope(SelectionScopeClient.defaultScope);
    } else {
      UiFramework.setActiveSelectionScope(selectionScope.setting);
    }
  }
}
