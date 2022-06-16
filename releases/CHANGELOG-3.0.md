## Breaking changes

### Removed

- The Tree View widget will no longer be a part of the Viewer by default
- The Property Grid widget will no longer be a part of the Viewer by default
- Selection Tools will no longer be a part of the Viewer by default
- Measure Tools will no longer be a part of the Viewer by default
- Navigation Tools will no longer be a part of the Viewer by default
- The status bar items will no longer be a part of the Viewer by default

All of these items can be easily added back via their respective UI Providers and initialized in the onIModelAppInit callback:

```tsx
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import {
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import {
  PropertyGridManager,
  PropertyGridUiItemsProvider,
} from "@itwin/property-grid-react";
import {
  TreeWidget,
  TreeWidgetUiItemsProvider,
} from "@itwin/tree-widget-react";
import {
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import React, { useCallback, useMemo, useState } from "react";

export const App: React.FC = () => {
  const [iModelId, setIModelId] = useState(
    process.env.IMJS_AUTH_CLIENT_IMODEL_ID
  );
  const [iTwinId, setITwinId] = useState(process.env.IMJS_AUTH_CLIENT_ITWIN_ID);

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

  const onIModelAppInit = useCallback(async () => {
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Viewer
        authClient={authClient}
        iTwinId={iTwinId ?? ""}
        iModelId={iModelId ?? ""}
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
          new TreeWidgetUiItemsProvider(),
          new PropertyGridUiItemsProvider({
            enableCopyingPropertyText: true,
          }),
          new MeasureToolsUiItemsProvider(),
        ]}
      />
    </div>
  );
};
```

- Removed support for Azure Application Insights
- Removed the BlankViewer component. Instead the desktop and web Viewer components now support BlankConnections and the props that were previously reserved for the BlankViewer

### New minimum iTwin.js version

- With the addition of support for [iTwin.js extensions](#itwinjs-extensions), which were introduced in iTwin.js version 3.2.0, the Viewer packages now require that version as the minimum version of all iTwin.js peerDependencies (packages in the `@itwin` scope)

## New Features

### iTwin.js Extensions

- While still in alpha and subject to change, iTwin Viewer 3.0 adds support for local and remote iTwin.js Extensions:

```tsx
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";
import LocalExtension from "@itwin/test-local-extension";
import { Viewer } from "@itwin/web-viewer-react";
import React, { useCallback, useMemo, useState } from "react";

export const App: React.FC = () => {
  const [iModelId, setIModelId] = useState(
    process.env.IMJS_AUTH_CLIENT_IMODEL_ID
  );
  const [iTwinId, setITwinId] = useState(process.env.IMJS_AUTH_CLIENT_ITWIN_ID);

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

  return (
    <div style={{ height: "100vh" }}>
      <Viewer
        authClient={authClient}
        iTwinId={iTwinId ?? ""}
        iModelId={iModelId ?? ""}
        enablePerformanceMonitors={true}
        extensions={[
          new LocalExtensionProvider({
            manifestPromise: LocalExtension.manifestPromise,
            main: LocalExtension.main,
          }),
          new RemoteExtensionProvider({
            jsUrl: "http://localhost:3001/dist/index.js",
            manifestUrl: "http://localhost:3001/package.json",
          }),
        ]}
      />
    </div>
  );
};
```

### realityDataAccess configuration

- Added support for iTwin.js realityDataAccess configuration

### New error components

- Replaced the error handling components from the @itwin/error-handling-react package with similar components from the iTwin UI package

## How to upgrade an exisiting application

- Change the version of `@itwin/web-viewer-react` or `@itwin/desktop-viewer-react` in your package.json to the following:

  ```
    "dependencies": {
      ...
      "@itwin/web-viewer-react": "^3.0.0",
      ...
    },
  ```

  ```
  "dependencies": {
    ...
    "@itwin/desktop-viewer-react": "^3.0.0",
    ...
  },
  ```

- React to the [breaking changes](#breaking-changes) above.

## Quick start a new application

- iTwin Viewer for Web

  ```sh
  npx create-react-app web-viewer-app --template @itwin/web-viewer --scripts-version @bentley/react-scripts
  ```

- iTwin Viewer for Desktop

  ```sh
  npx create-react-app desktop-viewer-app --template @itwin/desktop-viewer --scripts-version @bentley/react-scripts
  ```

## Bug Fixes

- Fixed an issue where backstage item labels were not showing
- No longer using a seed view by default when generating the default view of an iModel

## Optimizations

- Added additional environment variables to optimize the build in the Web Viewer template
