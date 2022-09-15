# Change Log - @itwin/cra-template-desktop-viewer

This log was last generated on Mon, 20 Jun 2022 14:39:09 GMT and should not be manually modified.

## 3.0.0
Mon, 20 Jun 2022 14:39:09 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-3.0.md).

## 2.0.3
Mon, 16 May 2022 15:03:07 GMT

### Patches

- Fix env var spelling

## 2.0.2
Mon, 07 Feb 2022 13:54:26 GMT

### Patches

- Bug fixes

## 2.0.1
Tue, 25 Jan 2022 22:20:19 GMT

### Patches

- Update to always pull in latest version of viewer

## 2.0.0
Tue, 25 Jan 2022 20:14:40 GMT

### Breaking changes

- Upgrade to iTwin.js 3.0

## 1.4.1
Thu, 16 Dec 2021 21:14:32 GMT

### Patches

- Update the status bar item UX

## 1.4.0
Tue, 07 Dec 2021 19:40:48 GMT

### Minor changes

- Add support for local briefcases

## 1.3.2
Wed, 29 Sep 2021 17:19:00 GMT

### Patches

- Fix issues with duplicate menu listeners

## 1.3.1
Tue, 28 Sep 2021 22:45:05 GMT

### Patches

- Update localized strings

## 1.3.0
Tue, 28 Sep 2021 21:15:48 GMT

### Minor changes

- Upgrade the UX

## 1.2.0
Mon, 16 Aug 2021 15:22:00 GMT

### Minor changes

- proxy frontend ipc calls to remove some boilerplate for defining new ipc calls

## 1.1.0
Wed, 04 Aug 2021 19:32:44 GMT

### Minor changes

- Default to using `ims.bentley.com` for auth issuer. Newly registered apps at [developer.bentley.com](https://developer.bentley.com/register/) will use the `itwinjs` scope under the Visualization API section, eliminating the need for having the following scopes: `rbac-user:external-client`, `projectwise-share`, `product-settings-service`, `context-registry-service:read-only`, and `imodelhub`. Users will now be able to make requests to other iTwin Platform APIs without having to manage a separate client. If you have an app generated from an older template, update your app to use the new issuer and add the new scope.

## 1.0.5
Wed, 21 Jul 2021 19:45:37 GMT

### Patches

- Execute the fitview tool when the iModel is loaded

## 1.0.4
Wed, 21 Jul 2021 15:33:11 GMT

### Patches

- fix build:frontend command

## 1.0.3
Fri, 16 Jul 2021 13:42:02 GMT

### Patches

- Upgrade minimum iTwin Viewer version

## 1.0.2
Wed, 07 Jul 2021 21:58:42 GMT

### Patches

- Bump bentley/react-scripts to ^4.0.3, ts to ~4.3, add some default env configs

## 1.0.1
Thu, 01 Jul 2021 18:46:45 GMT

### Patches

- Bump bentley/react-scripts to ^3.4.13

## 1.0.0
Wed, 30 Jun 2021 19:45:03 GMT

### Breaking changes

- update deps and browserlist, bump to 1.0

## 0.1.1
Wed, 30 Jun 2021 18:27:06 GMT

### Patches

- Create CRA template for desktop apps

