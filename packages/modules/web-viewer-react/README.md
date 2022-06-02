# iTwin Viewer for Web

The iTwin Web Viewer is a configurable iTwin.js viewer that offers basic tooling and widgets out-of-the-box and can be further extended through the use of [iTwin.js UI Providers](https://www.itwinjs.org/learning/ui/augmentingui/). This package should be used for web-based applications. For desktop applications, use [@itwin/desktop-viewer-react](https://www.npmjs.com/package/@itwin/desktop-viewer-react).

## Installation

```
yarn add @itwin/web-viewer-react
```

or

```
npm install @itwin/web-viewer-react
```

## Dependencies

If you are creating a new application and are using React, it is advised that you use create-react-app with @bentley/react-scripts. There is also a predefined template that includes the iTwin Viewer package:

```
npx create-react-app my-app --scripts-version @bentley/react-scripts --template @itwin/web-viewer
```

## React component

```javascript
import React, { useState, useEffect, useMemo } from "react";
import { Viewer } from "@itwin/web-viewer-react";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

export const MyViewerComponent = () => {
  const iTwinId = "myITwinId";
  const iModelId = "myIModelId";

  // authorization client
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

- `iTwinId` - GUID for the iTwin (project, asset, etc.) that contains the iModel that you wish to view
- `iModelId` - GUID for the iModel that you wish to view
- `authClient` - Client that implements the [ViewerAuthorizationClient](https://github.com/iTwin/viewer/blob/master/packages/modules/viewer-react/src/services/auth/ViewerAuthorization.ts) interface
- `enablePerformanceMonitors` - Enable reporting of data from timed events in the iTwin Viewer in order to aid in future performance optimizations. These are the metrics that will be collected and logged to the browser's performance timeline as well as to Azure Application Insights:
  - Duration of startup to the initialization of iTwin.js services
  - Duration of startup to the establishment of a connection to the iModel
  - Duration of startup to the creation of a view state for the iModel
  - Duration of startup until the last tile is loaded and rendered for the initial iModel view

#### Optional

- `changeSetId` - changeset id to view if combined with the iTwinId and iModelId props
- `backend` - backend connection info (defaults to the iTwin General Purpose backend)
- `theme` - override the default theme
- `defaultUiConfig` - hide or override default tooling and widgets
  - `contentManipulationTools` - options for the content manipulation section (top left)
    - `cornerItem` - replace the default backstage navigation button with a new item
    - `hideDefaultHorizontalItems` - hide all horizontal tools in the top left section of the viewer
    - `hideDefaultVerticalItems` - hide all vertical tools in the top left section of the viewer
    - `verticalItems`
      - `selectTool` - hide the select tool
      - `measureTools` - hide the measure tools
      - `sectionTools` - hide the section tools
    - `horizontalItems`
      - `clearSelection` - hide the clear selection tool
      - `clearHideIsolateEmphasizeElements` - hide the clear hide/isolate/emphasize elements tool
      - `hideElements` - hide the hide elements tool
      - `isolateElements` - hide the isolate elements tool
      - `emphasizeElements` - hide the emphasize elements tool
  - `navigationTools` - options for the navigation section (top right)
    - `hideDefaultHorizontalItems` - hide all horizontal tools in the top right section of the viewer
    - `hideDefaultVerticalItems` - hide all vertical tools in the top right section of the viewer
    - `verticalItems`
      - `walkView` - hide the walk tool
      - `cameraView` - hide the camera tool
    - `horizontalItems`
      - `rotateView` - hide the rotate tool
      - `panView` - hide the pan tool
      - `fitView` - hide the fit view tool
      - `windowArea` - hide the window area tool
      - `undoView` - hide the undo view changes tool
      - `redoView` - hide the redo view changes tool
  - `hideToolSettings` - hide the contextual tool settings
  - `hideTreeView` - hide the tree view widget
  - `hidePropertyGrid` - hide the property grid widget
  - `hideDefaultStatusBar` - hide the status bar
- `productId` - application's GPRID
- `appInsightsKey` - Application Insights key for telemetry
- `onIModelConnected` - Callback function that executes after the iModel connection is successful and contains the iModel connection as a parameter
- `i18nUrlTemplate` - Override the default url template where i18n resource files are queried
- `frontstages` - Provide additional frontstages for the viewer to render
- `backstageItems` - Provide additional backstage items for the viewer's backstage composer
- `onIModelAppInit` - Callback function that executes after IModelApp.startup completes
- `viewportOptions` - Additional options for the default frontstage's IModelViewportControl
- `additionalI18nNamespaces` - Additional i18n namespaces to register
- `additionalRpcInterfaces` - Additional rpc interfaces to register (assumes that they are supported in your backend)
- `toolAdmin` - Optional `ToolAdmin` to register
- `imodelClient` - provide a client other than the default iModelHub client to access iModels (i.e. iModelBankClient)
- `loadingComponent` - provide a custom React component to override the spinner and text that displays when an iModel is loading

## Typescript API

```html
<html>
  <div id="viewerRoot">
</html>
```

```javascript
import { ItwinViewer } from "@itwin/web-viewer-react";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

const iTwinId = "myITwinId";
const iModelId = "myIModelId";

// authorization client
const authClient = new BrowserAuthorizationClient({
  scope: "profile email",
  clientId: "my-oidc-client",
  redirectUri: "https://myredirecturi.com",
  postSignoutRedirectUri: "https://mypostsignouturi.com",
  responseType: "code",
});

const viewer = new iTwinViewer({
  elementId: "viewerRoot",
  authClient,
});

if (viewer) {
  viewer.load({ iTwinId, iModelId });
}
```

## Blank Viewer

For cases where you would prefer to use a [Blank iModelConnection](https://www.itwinjs.org/learning/frontend/blankconnection/), you should use the BlankViewer React component.

```javascript
import React, { useState, useEffect } from "react";
import { BlankConnectionViewState, BlankViewer } from "@itwin/web-viewer-react";
import { Range3d } from "@itwin/core-geometry";
import { Cartographic, ColorDef } from "@itwin/core-common";
import { BrowserAuthorizationClient } from "@itwin/browser-authorization";

export const MyBlankViewerComponent = () => {
  const blankConnection: BlankConnectionProps = {
    name: "GeometryConnection",
    location: Cartographic.fromDegrees(0, 0, 0),
    extents: new Range3d(-30, -30, -30, 30, 30, 30),
  };

  const viewStateOptions: BlankConnectionViewState = {
    displayStyle: {
      backgroundColor: ColorDef.blue,
    },
  };

  // authorization client
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
    <BlankViewer
      authClient={authClient}
      blankConnection={blankConnection}
      viewStateOptions={viewStateOptions}
    />
  );
};
```

It allows for most of the same optional props as the Viewer component, with a few differences:

#### Required

- `blankConnection` - Data to use to create the BlankConnection (name, location, extents, etc.). Note that no iTwinId or iModelId is required for this component

#### Optional

- `viewStateOptions` - Override options for the ViewState that is generated for the BlankConnection

# Development

When making changes to the src, run `npm start` in the package's root folder to enable source watching and rebuild, so the dev-server will have access to updated code on succesful code compilation.

# Next Steps

[Extending the iTwin Viewer](https://www.itwinjs.org/learning/tutorials/hello-world-viewer/)
