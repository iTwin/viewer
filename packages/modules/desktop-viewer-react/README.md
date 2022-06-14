# iTwin Viewer for Desktop

The iTwin Desktop Viewer is a configurable iTwin.js viewer that offers basic configuration out-of-the-box and can be further extended through the use of [iTwin.js UI Providers](https://www.itwinjs.org/learning/ui/augmentingui/). This package should be used for Electron-based desktop applications. For web applications, use [@itwin/web-viewer-react](https://www.npmjs.com/package/@itwin/web-viewer-react).

## Installation

```
yarn add @itwin/desktop-viewer-react
```

or

```
npm install @itwin/desktop-viewer-react
```

## Dependencies

If you are creating a new application and are using React, it is advised that you use create-react-app with `@bentley/react-scripts`. There is also a predefined template that includes the iTwin Viewer package:

```
npx create-react-app@latest my-app --scripts-version @bentley/react-scripts --template @itwin/desktop-viewer
```

## React component

```javascript
import React, { useState, useEffect } from "react";
import { Viewer } from "@itwin/desktop-viewer-react";

export const MyViewerComponent = () => {
  const snapshotPath = "./samples/house_model.bim";

  return (
    <Viewer filePath={snapshotPath} enablePerformanceMonitors={true} />
  );
};
```

### Props

#### Required

- `enablePerformanceMonitors` - Enable reporting of data from timed events in the iTwin Viewer in order to aid in future performance optimizations. These are the metrics that will be collected and logged to the browser's performance timeline:
  - Duration of startup to the initialization of iTwin.js services
  - Duration of startup to the establishment of a connection to the iModel
  - Duration of startup to the creation of a view state for the iModel
  - Duration of startup until the last tile is loaded and rendered for the initial iModel view

##### Local iModel

- `filePath` - path to a local Briefcase or Snapshot to load in the viewer. If provided, it will take precedence over any iTwinId/iModelId that may also be provided

##### Connected iModel

- `iTwinId` - GUID for the iTwin (project, asset, etc.) that contains the iModel that you wish to view
- `iModelId` - GUID for the iModel that you wish to view

##### Blank Connections

- `blankConnection` - Data to use to create the BlankConnection (name, location, extents, etc.). Note that this can't be used in conjunction with the iTwinId or iModelId prop.

#### Optional

- `changeSetId` - Changeset id to view if combined with the iTwinId and iModelId props
- `blankConnectionViewState` - Override options for the ViewState that is generated for the BlankConnection

- `backend` - Backend connection info (defaults to the iTwin Platform's iModel Access Service)

- `theme` - Override the default theme
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
- `additionalRpcInterfaces` - Additional rpc interfaces to register (assumes that they are supported in your backend)
- `extensions` - Provide extensions for the viewer
- `hubAccess` - Optional `hubAccess` to override the Viewer's default hub access
- `mapLayerOptions` - Optional key value pair to provide map layers
- `toolAdmin` - Optional `ToolAdmin` to override the Viewer's default tool admin
- `tileAdmin` - Optional `tileAdmin` to override the Viewer's default tile admin
- `renderSys` - Optional `renderSys` to override the Viewer's default render system
- `realityDataAccess` - Optional `realityDataAccess` to override the Viewer's default reality data access

# Development

When making changes to the src, run `npm start` in the package's root folder to enable source watching and rebuild, so the dev-server will have access to updated code on successful code compilation.

# Next Steps

[Extending the iTwin Viewer](https://www.itwinjs.org/learning/tutorials/hello-world-viewer/)
