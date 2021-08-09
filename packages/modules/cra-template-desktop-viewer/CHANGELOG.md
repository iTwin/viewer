# Change Log - @itwin/cra-template-desktop-viewer

This log was last generated on Wed, 04 Aug 2021 19:32:44 GMT and should not be manually modified.

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

