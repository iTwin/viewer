# iTwin Viewer 4.0

## Breaking changes

### Removed

The following prop(s) have been removed from the Viewer component.

- `blankConnection`
  - Please use `location` and `extents` instead

### Replaced

#### web & desktop viewer

The following prop(s) have been replaced in the Viewer component.

- `additionalRpcInterfaces` with `rpcInterfaces`
- `uiProviders` are now of type `UiProvider[]` from `@itwin/appui-react` instead of `@itwin/appui-abstract`

#### web-viewer

- `backend` with `backendConfiguration`

### Updated minimum versions

- The minimum `iTwin.js Core` and `AppUI` versions have been updated to `^4.0.0`
- The minimum `electron` version for the desktop-viewer has been updated to `^24.0.0`
- Now deliver `ES2021`

## How to upgrade from 3.0

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