# Change Log - @itwin/cra-template-web-viewer

This log was last generated on Wed, 04 Aug 2021 19:32:44 GMT and should not be manually modified.

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

