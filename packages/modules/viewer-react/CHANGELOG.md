# Change Log - @itwin/viewer-react

This log was last generated on Thu, 03 Jul 2025 10:36:27 GMT and should not be manually modified.

## 5.0.0
Thu, 03 Jul 2025 10:36:27 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-5.0.md).

## 4.10.0
Thu, 01 May 2025 21:20:17 GMT

### Minor changes

- Added missing peer dependencies that are used but not specified.

## 4.9.0
Fri, 14 Mar 2025 00:25:22 GMT

### Minor changes

- Add an optional `selectionScopes` prop to allow directly controlling available and active selection scopes.

## 4.8.4
Mon, 13 Jan 2025 18:37:59 GMT

### Patches

- iTwin Platform Reality Data has been deprecated; replaced with Reality Management > Reality Data"

## 4.8.3
Fri, 01 Nov 2024 14:07:47 GMT

### Patches

- Update Presentation packages to ^1.0.0

## 4.8.2
Thu, 22 Aug 2024 08:01:56 GMT

### Patches

- Fixed possible race condition when opening iModelConnection in React StrictMode.

## 4.8.1
Mon, 12 Aug 2024 15:19:39 GMT

### Patches

- Modifty accepted version for the peerDependency @itwin/presentation-components to allow version ^5.0.0 (^4.0.0 || ^5.0.0)
- Bump @itwin/presentation-components from v4 to v5

## 4.8.0
Mon, 05 Aug 2024 06:05:01 GMT

### Minor changes

- Integrated `@itwin/unified-selection` for unified selection handling when `SelectionStorage` is provided.

## 4.7.0
Fri, 24 May 2024 16:04:17 GMT

### Minor changes

- Added ability to supply custom Presentation initialization props

## 4.6.2
Thu, 22 Feb 2024 19:25:13 GMT

### Patches

- Localized BaseViewer strings.

## 4.6.1
Fri, 22 Sep 2023 16:46:01 GMT

### Patches

- Fix sync selection scope error when the iModelConnection is blank

## 4.6.0
Thu, 21 Sep 2023 19:31:41 GMT

### Minor changes

- Expose the userPreferences initialization option from IModelApp.

## 4.5.0
Fri, 08 Sep 2023 17:51:30 GMT

### Minor changes

- Remove auth check when viewing BlankConnections, removed iTwinId requirements when creating Viewer for BlankConnection

## 4.4.2
Tue, 05 Sep 2023 20:23:39 GMT

### Patches

- Sync Selection Scope List, Active Selection Scope & Selection Count between Presentation and AppUI

## 4.4.1
Tue, 29 Aug 2023 20:16:30 GMT

### Patches

- `useAccessToken` will always return a string, `""` denotes an invalid token.

## 4.4.0
Wed, 23 Aug 2023 21:29:07 GMT

### Minor changes

- Expose corner button for defaultUiConfig and add backstage corner button when there are backstage items provided

## 4.3.0
Wed, 02 Aug 2023 12:31:38 GMT

### Minor changes

- Export `UnifiedSelectionViewportControl`

## 4.2.1
Fri, 28 Jul 2023 20:20:58 GMT

### Patches

- Allow a notification manager to be configured on the <WebViewer> component

## 4.2.0
Wed, 19 Jul 2023 13:01:25 GMT

### Minor changes

- Update peers to now allow support of React 18, see [their changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md)

## 4.1.0
Thu, 22 Jun 2023 22:45:53 GMT

### Minor changes

- Expose option to open up a local briefcase in write-mode via `readonly` `@alpha` prop which can be removed at any time

## 4.0.3
Thu, 01 Jun 2023 13:42:05 GMT

### Patches

- Use itwin/reality-data-client@1.0.0

## 4.0.2
Tue, 30 May 2023 14:17:32 GMT

### Patches

- Exposing default frontstage id as a const

## 4.0.1
Fri, 26 May 2023 12:04:29 GMT

### Patches

- Adding @itwin/presentation-components to peerDependencies in @itwin/viewer-react

## 4.0.0
Wed, 24 May 2023 21:22:26 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-4.0.md).

## 3.5.0
Mon, 15 May 2023 15:10:14 GMT

### Minor changes

- Add default instance of AccuDraw

## 3.4.1
Tue, 28 Mar 2023 20:57:53 GMT

### Patches

- Fix Viewer rerendering on sibling component change

## 3.4.0
Tue, 28 Mar 2023 19:01:29 GMT

### Minor changes

- Expand semver range for `@itwin/imodels-*` peer deps to support 2.x and 3.x. [See their changelog](https://github.com/iTwin/imodels-clients/blob/main/itwin-platform-access/imodels-access-frontend/CHANGELOG.md)

## 3.3.2
Thu, 19 Jan 2023 13:51:30 GMT

### Patches

- use lodash.isEqual which tracks traversed objects enabling objects with circular references to be compared and prevents OOM

## 3.3.1
Wed, 16 Nov 2022 07:15:12 GMT

### Patches

- Added @itwin/imodels-client-management as peer dependency

## 3.3.0
Thu, 10 Nov 2022 13:34:14 GMT

### Minor changes

- blank connection will be created if iTwinId is supplied and iModelId is not; deprecate blankConnectionProps

## 3.2.2
Wed, 21 Sep 2022 12:09:30 GMT

### Patches

- add `OptionalToUndefinedUnion` utility type to fix missing params from iTwinViewerInitializerParamSample and getIModelAppOptions

## 3.2.1
Wed, 20 Jul 2022 14:16:19 GMT

### Patches

- Avoid StateManager re-initialization.

## 3.2.0
Wed, 20 Jul 2022 03:20:17 GMT

### Minor changes

- Use `globalThis` instead of `process.env` to set env at runtime

## 3.1.2
Tue, 19 Jul 2022 19:45:36 GMT

### Patches

- Expose option to hide tool settings

## 3.1.1
Thu, 07 Jul 2022 21:04:19 GMT

### Patches

- Use LookAndMove tool as default walk tool

## 3.1.0
Thu, 07 Jul 2022 18:12:22 GMT

### Minor changes

- Add implementation of AccuSnap that obtains the snap modes off the UiFramework. Fix issues where changing the SnapMode in the UI wouldn't reflect in AccuSnap.

## 3.0.1
Tue, 05 Jul 2022 20:30:55 GMT

### Patches

- Added custom localization option

## 3.0.0
Mon, 20 Jun 2022 14:39:09 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-3.0.md).

## 2.5.0
Mon, 23 May 2022 21:37:15 GMT

### Minor changes

- Expose `renderSys` option for IModelApp

## 2.4.0
Mon, 16 May 2022 15:03:07 GMT

### Minor changes

- Update default widgets from viewer-components-react

## 2.3.2
Wed, 02 Mar 2022 18:47:06 GMT

### Patches

- No longer uses the ViewCreator seed by default

## 2.3.1
Thu, 17 Feb 2022 17:58:47 GMT

### Patches

- Do not use backstage items directly. Instead rely on the Provider

## 2.3.0
Wed, 16 Feb 2022 18:52:55 GMT

### Minor changes

- Update default IModel loader indicator

## 2.2.2
Fri, 11 Feb 2022 20:57:09 GMT

### Patches

- Code optimization and refactoring

## 2.2.1
Mon, 07 Feb 2022 14:48:13 GMT

### Patches

- Add iModelConnecting performance measure

## 2.2.0
Tue, 01 Feb 2022 21:30:27 GMT

### Minor changes

- Add option for backgroundMap in BlankConnectionViewState.viewFlags

## 2.1.0
Thu, 27 Jan 2022 18:31:31 GMT

### Minor changes

- Add TileAdmin configuration option

## 2.0.1
Tue, 25 Jan 2022 22:20:19 GMT

### Patches

- Updated Changelog

## 2.0.0
Tue, 25 Jan 2022 20:14:40 GMT

### Breaking changes

- Upgrade to iTwin.js 3.0

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

