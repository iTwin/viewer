# Change Log - @itwin/viewer-react

This log was last generated on Tue, 25 Jan 2022 20:14:40 GMT and should not be manually modified.

## 2.0.0
Tue, 25 Jan 2022 20:14:40 GMT

### Breaking changes

- Upgrade to iTwin.js 3.0

#### iTwin.js

A comprehensive list of breaking changes in **3.0** can be found here, [iTwin.js 3.0 Changelog](https://www.itwinjs.org/changehistory/3.0.0/).

#### iTwin Viewer

##### Authorization

Authorization has been greatly simplified. Previously the `authConfig` prop in the `<Viewer />` component would accept a few different options, you could pass in your own AuthClient or config and we'd create one for you. We will no longer create an AuthClient for you, as that should be the responsibility of the App, not the Viewer. Instead, you need to provide your own AuthClient that implements a simpler interface.

```tsx
interface ViewerAuthorizationClient {
  getAccessToken(): Promise<AccessToken>;
  readonly onAccessTokenChanged: BeEvent<(token: AccessToken) => void>;
}
```

In addition, we have removed the header and login/logout buttons from the Create React App web application template in favor of auto-login.

##### Renamed

- The `contextId` prop has been renamed to `iTwinId`
- The `authConfig` prop has been renamed to `authClient` (see [Authorization](#authorization))

##### Removed

The following props have been removed.

- `uiFrameworkVersion`
- `imjsAppInsightsKey`
- `backend.buddiRegion`
- `backend.buddiServer`

##### Required

The following props are now required.

- `authClient`
- `enablePerformanceMonitors`

##### New peer dependencies

- [@itwin/imodels-access-frontend](https://www.npmjs.com/package/@itwin/imodels-access-frontend)
- [@itwin/imodels-client-management](https://www.npmjs.com/package/@itwin/imodels-client-management)
- [@itwin/reality-data-client](https://www.npmjs.com/package/@itwin/reality-data-client)

##### New scopes required

In your [iTwin App registration](https://developer.bentley.com/my-apps/), you'll need update your app to add the following scopes:

- `imodelaccess:read` (Visualization)
- `imodels:read` (Digital Twin Management > iModels)
- `realitydata:read` (Digital Twin Management > Reality Data)

These scopes are no longer required:

- `itwinjs`
- `openid`
- `email`
- `profile`
- `organization`

### New Features

#### Measure Tools

We've replaced the default measure-tools provided in the Viewer from itwinjs-core with the [@itwin/measure-tools-react](https://www.npmjs.com/package/@itwin/measure-tools-react) package.


## 1.9.1
Fri, 10 Dec 2021 14:41:02 GMT

### Patches

- Add check for BlankConnections when creating viewState as they are always closed

## 1.9.0
Tue, 07 Dec 2021 15:48:19 GMT

### Minor changes

- Add support for local briefcases

## 1.8.4
Fri, 19 Nov 2021 19:48:35 GMT

### Patches

- remove backend peer dep

## 1.8.3
Tue, 16 Nov 2021 17:38:03 GMT

### Patches

- Fix intellisense

## 1.8.2
Mon, 08 Nov 2021 20:49:09 GMT

### Patches

- Change iModel loading spinner to a bar and remove redundant text

## 1.8.1
Thu, 21 Oct 2021 14:29:56 GMT

### Patches

- Re-add the center and right zones for users who are still on ui-1.0"

## 1.8.0
Fri, 08 Oct 2021 17:32:09 GMT

### Minor changes

- Modified viewportOptions to accept async methods for viewstate and alwaysUseSuppliedViewState does not create a default viewState when true. De-prioritized viewportOptions.iModelConnection and viewportOptions.viewState in favor of allowing viewer to supply both. View states and iModel connetions provided by the viewportOptions prop will no longer be passed directly to the default frontstage.

## 1.7.1
Fri, 01 Oct 2021 13:57:31 GMT

### Patches

- Changed how viewstate is initialized and handled. Viewstate and the connection established by contextId & iModelId should be the same and the view will only render when both a connection and a viewstate has been established. Patched race condition and patched memory leak

## 1.7.0
Wed, 29 Sep 2021 17:58:34 GMT

### Minor changes

- Add support for a custom loading component

## 1.6.0
Tue, 28 Sep 2021 21:15:48 GMT

### Minor changes

- Add hook for pre-initialization

## 1.5.0
Thu, 26 Aug 2021 17:06:47 GMT

### Minor changes

- Use UiProvider to load PropertyGrid. Add SelectionInfo to statusbar"

## 1.4.2
Fri, 20 Aug 2021 19:35:01 GMT

### Patches

- Changed how cencelling initialization works. Cancelling now returns early.

## 1.4.1
Thu, 19 Aug 2021 16:48:09 GMT

### Patches

- Fix race condition with user provided viewstate

## 1.4.0
Mon, 16 Aug 2021 13:47:40 GMT

### Minor changes

- Updated base viewer to use the @bentley/tree-widget-react UiProvider instead of the widget control

## 1.3.0
Tue, 10 Aug 2021 14:16:48 GMT

### Minor changes

- Add support for custom iModelClient for iTwin Stack

## 1.2.4
Mon, 02 Aug 2021 19:16:49 GMT

### Patches

- remove internal ITwinViewerParams interface from base and promote it to the web-viewer pkg

## 1.2.3
Fri, 30 Jul 2021 15:01:33 GMT

### Patches

- Fixed bug with the height of the viewer when app insights were on

## 1.2.2
Wed, 28 Jul 2021 13:51:25 GMT

### Patches

- Added a component displaying Not Signed In when the user isn't authorized

## 1.2.1
Wed, 21 Jul 2021 19:45:37 GMT

### Patches

- don't run animation on fitview to avoid code path that throws an error in core

## 1.2.0
Fri, 16 Jul 2021 01:06:41 GMT

### Minor changes

- Fix view configuration and add the ability to customize the view

## 1.1.0
Thu, 15 Jul 2021 17:38:16 GMT

### Minor changes

- Updated walk tool to use the lookAndMove tool

## 1.0.6
Tue, 13 Jul 2021 14:25:52 GMT

### Patches

- Run the fit view tool on initial load

## 1.0.5
Mon, 12 Jul 2021 18:54:20 GMT

### Patches

- Allow creation of a default view if none exists in the model

## 1.0.4
Wed, 07 Jul 2021 21:58:42 GMT

### Patches

- Bump TS to ~4.3

## 1.0.3
Thu, 01 Jul 2021 18:46:45 GMT

### Patches

- drop dep on node-sass to fix cve-1753

## 1.0.2
Wed, 30 Jun 2021 18:27:06 GMT

### Patches

- Move types into web viewer package

## 1.0.1
Sun, 27 Jun 2021 21:12:37 GMT

### Patches

- update react-scripts

## 1.0.0
Fri, 04 Jun 2021 15:23:23 GMT

### Breaking changes

- Prepare README for 1.0 release

## 0.1.6
Wed, 19 May 2021 13:41:38 GMT

### Patches

- Temporarily remove support for runtime extensions

## 0.1.5
Mon, 17 May 2021 17:10:49 GMT

### Patches

- Updates to CRA template

## 0.1.4
Tue, 11 May 2021 13:38:27 GMT

### Patches

- Replace use of iModel.js with iTwin.js

## 0.1.3
Wed, 24 Mar 2021 21:48:57 GMT

### Patches

- README update

## 0.1.2
Wed, 24 Mar 2021 21:29:43 GMT

### Patches

- README updates

## 0.1.1
Wed, 24 Mar 2021 21:03:22 GMT

### Patches

- Initial add

