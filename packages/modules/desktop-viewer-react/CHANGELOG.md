# Change Log - @itwin/desktop-viewer-react

This log was last generated on Tue, 25 Jan 2022 20:14:40 GMT and should not be manually modified.

## 2.0.0
Tue, 25 Jan 2022 20:14:40 GMT

### Breaking changes

- Upgrade to iTwin.js 3.0

#### iTwin.js

A comprehensive list of breaking changes in **3.0** can be found here, [NextVersion.md](https://github.com/iTwin/itwinjs-core/blob/release/3.0.x/docs/changehistory/NextVersion.md).

#### iTwin Viewer

In addition, we have removed the header and login/logout buttons from the Create React App web application template in favor of auto-login.

##### Renamed

- The `contextId` prop has been renamed to `iTwinId`

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

## 1.2.1
Fri, 10 Dec 2021 14:41:02 GMT

*Version update only*

## 1.2.0
Tue, 07 Dec 2021 15:48:19 GMT

### Minor changes

- Add support for local briefcases

## 1.1.7
Fri, 19 Nov 2021 19:48:35 GMT

*Version update only*

## 1.1.6
Tue, 16 Nov 2021 17:38:03 GMT

### Patches

- Strongly type what's being memoized in initializer

## 1.1.5
Mon, 08 Nov 2021 20:49:09 GMT

*Version update only*

## 1.1.4
Thu, 21 Oct 2021 14:29:56 GMT

*Version update only*

## 1.1.3
Fri, 08 Oct 2021 17:32:09 GMT

*Version update only*

## 1.1.2
Fri, 01 Oct 2021 13:57:31 GMT

*Version update only*

## 1.1.1
Wed, 29 Sep 2021 17:58:34 GMT

*Version update only*

## 1.1.0
Tue, 28 Sep 2021 21:15:48 GMT

### Minor changes

- Add hook for pre-initialization 

## 1.0.16
Thu, 26 Aug 2021 17:06:47 GMT

*Version update only*

## 1.0.15
Fri, 20 Aug 2021 19:35:01 GMT

### Patches

- Changed how cencelling initialization works. Cancelling now returns early.

## 1.0.14
Thu, 19 Aug 2021 16:48:09 GMT

*Version update only*

## 1.0.13
Mon, 16 Aug 2021 13:47:40 GMT

*Version update only*

## 1.0.12
Tue, 10 Aug 2021 14:16:48 GMT

*Version update only*

## 1.0.11
Mon, 02 Aug 2021 19:16:49 GMT

*Version update only*

## 1.0.10
Fri, 30 Jul 2021 15:01:33 GMT

*Version update only*

## 1.0.9
Wed, 28 Jul 2021 13:51:25 GMT

*Version update only*

## 1.0.8
Wed, 21 Jul 2021 19:45:37 GMT

*Version update only*

## 1.0.7
Fri, 16 Jul 2021 01:06:41 GMT

*Version update only*

## 1.0.6
Thu, 15 Jul 2021 17:38:16 GMT

*Version update only*

## 1.0.5
Tue, 13 Jul 2021 14:25:52 GMT

*Version update only*

## 1.0.4
Mon, 12 Jul 2021 18:54:20 GMT

*Version update only*

## 1.0.3
Wed, 07 Jul 2021 21:58:42 GMT

### Patches

- Bump TS to ~4.3

## 1.0.2
Thu, 01 Jul 2021 18:46:45 GMT

*Version update only*

## 1.0.1
Wed, 30 Jun 2021 18:27:06 GMT

### Patches

- Update README

## 1.0.0
Sun, 27 Jun 2021 21:12:37 GMT

### Breaking changes

- Add desktop viewer package

