# Change Log - @itwin/cra-template-desktop-viewer

This log was last generated on Thu, 03 Jul 2025 10:36:27 GMT and should not be manually modified.

## 5.0.0
Thu, 03 Jul 2025 10:36:27 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-5.0.md).

## 4.5.7
Tue, 17 Jun 2025 18:10:29 GMT

### Patches

- pinning acorn to 8.14.0

## 4.5.6
Tue, 27 May 2025 16:14:39 GMT

### Patches

- remove direct dep @itwin/presentation-core-interop and add override for transient dependencies to 1.3.1

## 4.5.5
Tue, 13 May 2025 21:57:34 GMT

### Patches

- Adding unified-react dependency to desktop viewer template.

## 4.5.4
Mon, 17 Mar 2025 14:17:53 GMT

### Patches

- Fix build issue in desktop app template

## 4.5.3
Fri, 14 Mar 2025 00:25:22 GMT

### Patches

- Bump Presentation and `@itwin/property-grid-react` dependencies

## 4.5.2
Mon, 18 Nov 2024 15:26:35 GMT

### Patches

- Updated unified-selection version for template

## 4.5.1
Fri, 01 Nov 2024 21:36:57 GMT

### Patches

- update presentation-components and measure-tools to latest

## 4.5.0
Fri, 01 Nov 2024 14:07:47 GMT

### Minor changes

- Update tree-widget to 3.0

### Patches

- Update Presentation packages to ^1.0.0

## 4.4.3
Thu, 31 Oct 2024 13:22:46 GMT

### Patches

- Updated .env file in CRA template to have the `itwin-platform` scope.

## 4.4.2
Tue, 03 Sep 2024 18:26:05 GMT

### Patches

- fix unified selection storage imports

## 4.4.1
Tue, 03 Sep 2024 13:38:39 GMT

### Patches

- Fix @itwin/desktop-viewer-react package version

## 4.4.0
Mon, 05 Aug 2024 06:05:01 GMT

### Minor changes

- Integrated `@itwin/unified-selection` for unified selection handling when `SelectionStorage` is provided.

## 4.3.1
Fri, 06 Oct 2023 16:41:20 GMT

### Patches

- Refactor SelectIModel, fix missing file error

## 4.3.0
Thu, 21 Sep 2023 19:08:24 GMT

### Minor changes

- Update the app and components to use ITwinUI-layouts

## 4.2.0
Wed, 02 Aug 2023 12:31:38 GMT

### Minor changes

- Consume itwin/tree-widget-react@1.0.0 and itwin/property-grid-react@1.0.0

## 4.1.0
Tue, 25 Jul 2023 18:09:32 GMT

### Minor changes

- Changing from projects API to itwins API

## 4.0.1
Tue, 06 Jun 2023 15:05:19 GMT

### Patches

- Ugrading @itwin/tree-widget-react version

## 4.0.0
Wed, 24 May 2023 21:22:26 GMT

### Breaking changes

- See [release notes](https://github.com/iTwin/viewer/blob/master/releases/CHANGELOG-4.0.md).

## 3.1.2
Wed, 19 Apr 2023 13:42:11 GMT

### Patches

- Update readme

## 3.1.1
Wed, 19 Apr 2023 13:30:41 GMT

### Patches

- Add `USING_NPM` env var and default to true. Will be the case if bootstrapped using npx

## 3.1.0
Fri, 06 Jan 2023 14:28:28 GMT

### Minor changes

- Update react-scripts to v5

## 3.0.1
Wed, 16 Nov 2022 07:15:12 GMT

### Patches

- Removed @itwin/imodels-client-management as dependency

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

