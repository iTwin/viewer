# iTwin Viewer for Web

The iTwin Web Viewer is a configurable iTwin.js viewer that offers basic configuration out-of-the-box and can be further extended through the use of [iTwin.js UI Providers](https://www.itwinjs.org/learning/ui/augmentingui/). This package should be used for web-based applications. For desktop applications, use [@itwin/desktop-viewer-react](https://www.npmjs.com/package/@itwin/desktop-viewer-react).

## Installation

```bash
yarn add @itwin/web-viewer-react
```

or

```bash
npm install @itwin/web-viewer-react
```

## Dependencies

If you are creating a new application and are using React, it is advised that you use create-react-app with `@bentley/react-scripts`. There is also a predefined template that includes the iTwin Viewer package:

```bash
npx create-react-app@latest my-app --scripts-version @bentley/react-scripts --template @itwin/web-viewer
```

## React component

```javascript
import React, { useState, useEffect, useMemo } from "react";
import { Viewer } from "@itwin/web-viewer-react";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

export const MyViewerComponent = () => {
  const iTwinId = "myITwinId";
  const iModelId = "myIModelId";

  const authClient = useMemo(
    () =>
      new BrowserAuthorizationClient({
        scope: "profile email",
        clientId: "my-oidc-client",
        redirectUri: "https://myredirecturi.com",
        postSignoutRedirectUri: "https://mypostsignouturi.com",
        responseType: "code",
      }),
    []
  );

  return (
    <Viewer
      authClient={authClient}
      iTwinId={iTwinId}
      iModelId={iModelId}
      enablePerformanceMonitors={true}
    />
  );
};
```

### Props

#### Required

- `authClient` - Client that implements the [ViewerAuthorizationClient](https://github.com/iTwin/viewer/blob/master/packages/modules/viewer-react/src/services/auth/ViewerAuthorization.ts) interface
- `enablePerformanceMonitors` - Enable reporting of data from timed events in the iTwin Viewer in order to aid in future performance optimizations. These are the metrics that will be collected and logged to the browser's performance timeline:
  - Duration of startup to the initialization of iTwin.js services
  - Duration of startup to the establishment of a connection to the iModel
  - Duration of startup to the creation of a view state for the iModel
  - Duration of startup until the last tile is loaded and rendered for the initial iModel view

##### Connected iModel

- `iTwinId` - GUID for the iTwin (project, asset, etc.) that contains the iModel that you wish to view
- `iModelId` - GUID for the iModel that you wish to view

##### Blank Connections

- `location` - The spatial location for the blank connection.
- `extents` - The volume of interest, in meters, centered around location
- `iTwinId` - GUID for the iTwin (project, asset, etc.) that contains the iModel that you wish to views
- **Note**: The props above cannot be used in conjunction with iModelId
- **Note**: `authClient` props will be optional if only `location` and `extents` props are supplied. However, if the `iTwinId` prop also is passed into the Viewer component, `authClient` will be required.


#### Optional

- `changeSetId` - Changeset id to view if combined with the iTwinId and iModelId props
- `blankConnectionViewState` - Override options for the ViewState that is generated for the BlankConnection
- `backendConfiguration` - Manage backend(s) connection info and RPC Interfaces. [See below](#backend-configuration)
- `theme` - Override the default theme
- `defaultUiConfig` - hide parts of the default frontstage
  - `hideNavigationAid` - hide the navigation aid cube
  - `hideStatusBar` - hide the status bar
- `onIModelConnected` - Callback function that executes after the iModel connection is successful and contains the iModel connection as a parameter
- `frontstages` - Provide additional frontstages for the viewer to render
- `backstageItems` - Provide additional backstage items for the viewer's backstage composer
- `viewportOptions` - Additional options for the default frontstage's IModelViewportControl
- `uiProviders` - Extend the viewer's default ui
- `viewCreatorOptions` - Options for creating the default viewState
- `loadingComponent` - provide a custom React component to override the spinner when an iModel is loading
- `productId` - application's GPRID
- `i18nUrlTemplate` - Override the default url template where i18n resource files are queried
- `onIModelAppInit` - Callback function that executes after IModelApp.startup completes
- `additionalI18nNamespaces` - Additional i18n namespaces to register
- `extensions` - Provide extensions for the viewer
- `hubAccess` - Optional `hubAccess` to override the Viewer's default hub access
- `mapLayerOptions` - Optional key value pair to provide map layers
- `toolAdmin` - Optional `ToolAdmin` to override the Viewer's default tool admin
- `tileAdmin` - Optional `tileAdmin` to override the Viewer's default tile admin
- `renderSys` - Optional `renderSys` to override the Viewer's default render system
- `realityDataAccess` - Optional `realityDataAccess` to override the Viewer's default reality data access
- `localization` - Optional `localization` to provide your own Localization instance

## Blank Viewer

For cases where you would prefer to use a [Blank iModelConnection](https://www.itwinjs.org/learning/frontend/blankconnection/), you should supply the `location` and `extents` props to the Viewer React component. The `authClient` props will be optional unless the `iTwinId` prop is also supplied.

```javascript
import React, { useState, useEffect } from "react";
import { BlankConnectionViewState, Viewer } from "@itwin/web-viewer-react";
import { Range3d } from "@itwin/core-geometry";
import { Cartographic, ColorDef } from "@itwin/core-common";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

export const MyBlankViewerComponent = () => {
  const blankConnectionViewState: BlankConnectionViewState = {
    displayStyle: {
      backgroundColor: ColorDef.blue,
    },
  };

  const authClient = useMemo(
    () =>
      new BrowserAuthorizationClient({
        scope: "profile email",
        clientId: "my-oidc-client",
        redirectUri: "https://myredirecturi.com",
        postSignoutRedirectUri: "https://mypostsignouturi.com",
        responseType: "code",
      }),
    []
  );

  return (
    <Viewer
      authClient={authClient}
      location={Cartographic.fromDegrees(0, 0, 0)}
      extents={new Range3d(-30, -30, -30, 30, 30, 30)}
      blankConnectionViewState={blankConnectionViewState}
    />
  );
};
```

## Backend Configuration

If no `backendConfiguration` is specified, the backend defaults to the iTwin Platform's iModel Access Service. You can modify or override this default backend, add additional RpcInterfaces to it, and/or add additional backends. The below examples are not mutually exclusive.

### Default Backend

#### Change default backend details

```javascript
    // ... rest of code omitted
    <Viewer
      // ...other props omitted
      backendConfiguration={{
        defaultBackend: {
          config: {
            info: {
              title: "New Default Backend Title",
              version: "v5.0"
            },
            uriPrefix: "https://new-default-backend-uri"
          }
        }
      }}
    />
```

#### Add additional RPC Interfaces to Default Backend

```javascript
    // ... rest of code omitted
    <Viewer
      // ...other props omitted
      backendConfiguration={{
        defaultBackend: {
          rpcInterfaces: [
            MyRpcInterface,
            AnotherRpcInterface
          ]
        }
      }}
    />
```

### Custom Backends

Add one or more custom backends with any number of RPC Interfaces registered against each.

#### Example

```javascript
    // ... rest of code omitted
    <Viewer
      // ...other props omitted
      backendConfiguration={{
        customBackends: [
          { 
            config: {
              info: {
                title: "Custom Backend One",
                version: "v3.0"
              },
              uriPrefix: "https://custom-backend-uri"
            },
            rpcInterfaces: [
              BackendOneRpcInterface,
              BackendOneRpcInterfaceTwo
            ]
          },
          { 
            config: {
              info: {
                title: "Custom Backend Two",
                version: "v4.0"
              },
              uriPrefix: "https://custom-backend-two-uri"
            },
            rpcInterfaces: [
              BackendTwoRpcInterface
            ]
          }
        ]
      }}
    />
```

## Development

When making changes to the src, run `npm start` in the package's root folder to enable source watching and rebuild, so the dev-server will have access to updated code on successful code compilation.

## Next Steps

[Extending the iTwin Viewer](https://www.itwinjs.org/learning/tutorials/hello-world-viewer/)
