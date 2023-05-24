# Change Log - @itwin/cra-template-web-viewer

This log was last generated on Wed, 24 May 2023 21:22:26 GMT and should not be manually modified.

## 4.0.0
Wed, 24 May 2023 21:22:26 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-4.0.md).

## 3.2.2
Wed, 19 Apr 2023 13:42:11 GMT

### Patches

- Update readme

## 3.2.1
Wed, 19 Apr 2023 13:30:41 GMT

### Patches

- Add `USING_NPM` env var and default to true. Will be the case if bootstrapped using npx

## 3.2.0
Fri, 06 Jan 2023 14:28:28 GMT

### Minor changes

- Update react-scripts to v5

## 3.1.1
Wed, 16 Nov 2022 07:15:12 GMT

### Patches

- Added redux as dependency, removed @itwin/imodels-client-management as dependency

## 3.1.0
Thu, 10 Nov 2022 13:34:14 GMT

### Minor changes

- blank connection will be created if iTwinId is supplied and iModelId is not; deprecate blankConnectionProps

## 3.0.0
Mon, 20 Jun 2022 14:39:09 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-3.0.md).

## 2.0.5
Mon, 16 May 2022 15:03:07 GMT

### Patches

- Fix env var spelling

## 2.0.4
Tue, 29 Mar 2022 14:20:55 GMT

### Patches

- Add env vars for optimization

## 2.0.3
Mon, 07 Feb 2022 14:48:13 GMT

### Patches

- Add TileTreesLoaded performance measure

## 2.0.2
Wed, 26 Jan 2022 03:31:33 GMT

### Patches

- Add sign in loading bar indicator

## 2.0.1
Tue, 25 Jan 2022 22:20:19 GMT

### Patches

- Update to always pull in latest version of viewer

## 2.0.0
Tue, 25 Jan 2022 20:14:40 GMT

### Breaking changes

- Upgrade to iTwin.js 3.0

## 1.3.0
Tue, 12 Oct 2021 16:52:48 GMT

### Minor changes

- Revert Sandbox Export CRA Web Template Refactor (#47)

## 1.2.0
Thu, 30 Sep 2021 13:57:43 GMT

### Minor changes

- App.tsx refactored to modularize the viewer. A react context has been added to feed in the iModelId and contextId. The header has been removed and authentication is now automatically handled on app start.

## 1.1.0
Wed, 04 Aug 2021 19:32:44 GMT

### Minor changes

- Default to using `ims.bentley.com` for auth issuer. Newly registered apps at [developer.bentley.com](https://developer.bentley.com/register/) will use the `itwinjs` scope under the Visualization API section, eliminating the need for having the following scopes: `rbac-user:external-client`, `projectwise-share`, `product-settings-service`, `context-registry-service:read-only`, and `imodelhub`. Users will now be able to make requests to other iTwin Platform APIs without having to manage a separate client. If you have an app generated from an older template, update your app to use the new issuer and add the new scope.

## 1.0.7
Wed, 21 Jul 2021 19:45:37 GMT

### Patches

- Execute the fitview tool when the iModel is loaded

## 1.0.6
Fri, 16 Jul 2021 13:42:02 GMT

### Patches

- Upgrade minimum iTwin Viewer version

## 1.0.5
Wed, 07 Jul 2021 21:58:42 GMT

### Patches

- Bump bentley/react-scripts to ^4.0.3, ts to ~4.3, add some default env configs

## 1.0.4
Tue, 06 Jul 2021 20:16:10 GMT

### Patches

- Upgrade web-viewer-react min version

## 1.0.3
Thu, 01 Jul 2021 18:46:45 GMT

### Patches

- bump react-scripts to 3.4.13
- add other public assets like favicon, logos, manifest

## 1.0.2
Tue, 29 Jun 2021 14:16:33 GMT

### Patches

- bump version of bentley/react-scripts to get localized strings and static assets in development 

## 1.0.1
Sun, 27 Jun 2021 21:12:37 GMT

### Patches

- Upgrade react-scripts

## 1.0.0
Fri, 04 Jun 2021 15:23:23 GMT

### Breaking changes

- Prepare README for 1.0 release

## 0.1.5
Wed, 19 May 2021 13:41:38 GMT

### Patches

- Temporarily remove support for runtime extensions

## 0.1.4
Tue, 18 May 2021 18:50:47 GMT

### Patches

- Better handle missing env vars

## 0.1.3
Mon, 17 May 2021 17:10:49 GMT

### Patches

- Updates to CRA template

## 0.1.2
Wed, 24 Mar 2021 21:29:43 GMT

### Patches

- README updates

## 0.1.1
Wed, 24 Mar 2021 21:03:22 GMT

### Patches

- Initial add

