/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { AppNotificationManager, ColorTheme } from "@itwin/appui-react";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
// import { LocalExtensionProvider, RemoteExtensionProvider } from "@itwin/core-frontend";
import { ReactComponent as Itwin } from "../../images/itwin.svg";
import {
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import {
  AncestorsNavigationControls,
  CopyPropertyTextContextMenuItem,
  PropertyGridManager,
  PropertyGridUiItemsProvider,
  ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react";
// import LocalExtension from "@itwin/test-local-extension";
import {
  TreeWidget,
  TreeWidgetUiItemsProvider,
} from "@itwin/tree-widget-react";
import type { ViewerBackstageItem } from "@itwin/web-viewer-react";
import {
  Viewer,
  BackstageItemsProvider,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { history } from "../routing";
import { ECSchemaRpcInterface } from "@itwin/ecschema-rpcinterface-common";
import { getSchemaContext, unifiedSelectionStorage } from "../../selectionStorage";

/**
 * Test a viewer that uses auth configuration provided at startup
 * @returns
 */
const ViewerHome: React.FC = () => {
  const [iTwinId, setITwinId] = useState(process.env.IMJS_AUTH_CLIENT_ITWIN_ID);
  const [iModelId, setIModelId] = useState(
    process.env.IMJS_AUTH_CLIENT_IMODEL_ID
  );
  const [changesetId, setChangesetId] = useState(
    process.env.IMJS_AUTH_CLIENT_CHANGESET_ID
  );

  const authClient = useMemo(
    () =>
      new BrowserAuthorizationClient({
        scope: process.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
        clientId: process.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
        redirectUri: process.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
        postSignoutRedirectUri: process.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
        responseType: "code",
        authority: process.env.IMJS_AUTH_AUTHORITY,
      }),
    []
  );

  const login = useCallback(async () => {
    try {
      await authClient.signInSilent();
    } catch {
      await authClient.signIn();
    }
  }, [authClient]);

  useEffect(() => {
    void login();
  }, [login]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iTwinId")) {
      setITwinId(urlParams.get("iTwinId") as string);
    }
    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    }
    if (urlParams.has("changesetId")) {
      setChangesetId(urlParams.get("changesetId") as string);
    }
  }, []);

  useEffect(() => {
    let url = `viewer?iTwinId=${iTwinId}`;

    if (iModelId) {
      url = `${url}&iModelId=${iModelId}`;
    }

    if (changesetId) {
      url = `${url}&changesetId=${changesetId}`;
    }
    history.push(url);
  }, [iTwinId, iModelId, changesetId]);

  const Loader = () => {
    return <div>Things are happening...</div>;
  };

  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
  }, []);

  const backstageItems: ViewerBackstageItem[] = [
    {
      id: "BS1",
      execute: () => console.log("BS1"),
      groupPriority: 10,
      itemPriority: 30,
      label: "Backstage Items Provider 1",
    },
  ];

  const backstageItems2: ViewerBackstageItem[] = [
    {
      id: "BS4",
      execute: () => console.log("BS1"),
      groupPriority: 20,
      itemPriority: 100,
      label: "BackstageItems 1",
    }
  ];

  return (
    <div style={{ height: "100vh" }}>
      <Viewer
        authClient={authClient}
        iTwinId={iTwinId ?? ""}
        iModelId={iModelId ?? ""}
        changeSetId={changesetId}
        theme={ColorTheme.Dark}
        loadingComponent={<Loader />}
        mapLayerOptions={{
          BingMaps: {
            key: "key",
            value: process.env.IMJS_BING_MAPS_KEY ?? "",
          },
        }}
        backendConfiguration={{
          defaultBackend: {
            rpcInterfaces: [ECSchemaRpcInterface],
          },
        }}
        notifications={new AppNotificationManager()}
        enablePerformanceMonitors={true}
        onIModelAppInit={onIModelAppInit}
        uiProviders={[
          new BackstageItemsProvider(backstageItems, "BackstageItemsProvider1"),
          new ViewerNavigationToolsProvider(),
          new ViewerContentToolsProvider({
            vertical: {
              measureGroup: false,
            },
          }),
          new ViewerStatusbarItemsProvider(),
          new TreeWidgetUiItemsProvider(),
          new PropertyGridUiItemsProvider({
            propertyGridProps: {
              autoExpandChildCategories: true,
              ancestorsNavigationControls: (props) => (
                <AncestorsNavigationControls {...props} />
              ),
              contextMenuItems: [
                (props) => <CopyPropertyTextContextMenuItem {...props} />,
              ],
              settingsMenuItems: [
                (props) => (
                  <ShowHideNullValuesSettingsMenuItem
                    {...props}
                    persist={true}
                  />
                ),
              ],
            },
          }),
          new MeasureToolsUiItemsProvider(),
        ]}
        // extensions={[
        //   new LocalExtensionProvider({
        //     manifestPromise: LocalExtension.manifestPromise,
        //     main: LocalExtension.main,
        //   }),
        //   new RemoteExtensionProvider({
        //     jsUrl: "http://localhost:3001/dist/index.js",
        //     manifestUrl: "http://localhost:3001/package.json",
        //   }),
        // ]}
        backstageItems={backstageItems2}
        defaultUiConfig={{cornerButton: <Itwin />}}
        // renderSys={{doIdleWork: true}}
        selectionStorage={unifiedSelectionStorage}
        getSchemaContext={getSchemaContext}
      />
    </div>
  );
};

export default ViewerHome;
