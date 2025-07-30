/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { AppNotificationManager } from "@itwin/appui-react";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import {
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import {
  AncestorsNavigationControls,
  CopyPropertyTextContextMenuItem,
  createPropertyGrid,
  PropertyGridManager,
  ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react";
import {
  CategoriesTreeComponent,
  createTreeWidget,
  ModelsTreeComponent,
  TreeWidget,
} from "@itwin/tree-widget-react";
import type { ViewerBackstageItem } from "@itwin/web-viewer-react";
import {
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// import { LocalExtensionProvider, RemoteExtensionProvider } from "@itwin/core-frontend";
import { ReactComponent as Itwin } from "../../images/itwin.svg";
import {
  unifiedSelectionStorage,
} from "../../selectionStorage";
import { history } from "../routing";

/**
 * Test a viewer that uses auth configuration provided at startup
 * @returns
 */
const ViewerHome: React.FC = () => {
  const [iTwinId, setITwinId] = useState(import.meta.env.IMJS_AUTH_CLIENT_ITWIN_ID);
  const [iModelId, setIModelId] = useState(
    import.meta.env.IMJS_AUTH_CLIENT_IMODEL_ID
  );
  const [changesetId, setChangesetId] = useState(
    import.meta.env.IMJS_AUTH_CLIENT_CHANGESET_ID
  );

  const authClient = useMemo(
    () =>
      new BrowserAuthorizationClient({
        scope: import.meta.env.IMJS_AUTH_CLIENT_SCOPES ?? "",
        clientId: import.meta.env.IMJS_AUTH_CLIENT_CLIENT_ID ?? "",
        redirectUri: import.meta.env.IMJS_AUTH_CLIENT_REDIRECT_URI ?? "",
        postSignoutRedirectUri: import.meta.env.IMJS_AUTH_CLIENT_LOGOUT_URI,
        responseType: "code",
        authority: import.meta.env.IMJS_AUTH_AUTHORITY,
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

  return (
    <div style={{ height: "100vh" }}>
      <Viewer
        authClient={authClient}
        iTwinId={iTwinId ?? ""}
        iModelId={iModelId ?? ""}
        changeSetId={changesetId}
        loadingComponent={<Loader />}
        mapLayerOptions={{
          BingMaps: {
            key: "key",
            value: import.meta.env.IMJS_BING_MAPS_KEY ?? "",
          },
        }}
        notifications={new AppNotificationManager()}
        enablePerformanceMonitors={true}
        onIModelAppInit={onIModelAppInit}
        uiProviders={[
          new ViewerNavigationToolsProvider(),
          new ViewerContentToolsProvider({
            vertical: {
              measureGroup: false,
            },
          }),
          new ViewerStatusbarItemsProvider(),
          {
            id: "TreeWidgetUIProvider",
            getWidgets: () => [
              createTreeWidget({
                trees: [
                  {
                    id: ModelsTreeComponent.id,
                    getLabel: () => ModelsTreeComponent.getLabel(),
                    render: (props) => (
                      <ModelsTreeComponent
                        getSchemaContext={(iModel) => iModel.schemaContext}
                        density={props.density}
                        selectionStorage={unifiedSelectionStorage}
                        selectionMode={"extended"}
                        onPerformanceMeasured={props.onPerformanceMeasured}
                        onFeatureUsed={props.onFeatureUsed}
                      />
                    ),
                  },
                  {
                    id: CategoriesTreeComponent.id,
                    getLabel: () => CategoriesTreeComponent.getLabel(),
                    render: (props) => (
                      <CategoriesTreeComponent
                        getSchemaContext={(iModel) => iModel.schemaContext}
                        density={props.density}
                        selectionStorage={unifiedSelectionStorage}
                        onPerformanceMeasured={props.onPerformanceMeasured}
                        onFeatureUsed={props.onFeatureUsed}
                      />
                    ),
                  },
                ],
                onPerformanceMeasured: (feature, elapsedTime) => {
                  console.log(`TreeWidget [${feature}] took ${elapsedTime} ms`);
                },
                onFeatureUsed: (feature) => {
                  console.log(`TreeWidget [${feature}] used`);
                },
              }),
            ],
          },
          {
            id: "PropertyWidgetUIProvider",
            getWidgets: () => [
              createPropertyGrid({
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
                selectionStorage: unifiedSelectionStorage,
              }),
            ],
          },
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
        defaultUiConfig={{ cornerButton: <Itwin /> }}
        // renderSys={{doIdleWork: true}}
        selectionStorage={unifiedSelectionStorage}
        selectionScopes={{
          active: "element",
          available: availableSelectionScopes,
        }}
      />
    </div>
  );
};

const availableSelectionScopes = {
  element: {
    label: "Element",
    def: { id: "element" as const },
  },
  assembly: {
    label: "Assembly",
    def: { id: "element" as const, ancestorLevel: 1 },
  },
  "top-assembly": {
    label: "Top assembly",
    def: { id: "element" as const, ancestorLevel: -1 },
  }
};

export default ViewerHome;
