## Breaking changes

### iTwin.js

A comprehensive list of breaking changes in **3.0** can be found here, [NextVersion.md](https://github.com/iTwin/itwinjs-core/blob/master/docs/changehistory/NextVersion.md).

### iTwin Viewer

#### Authorization

Authorization has been greatly simplified. Previously the `authConfig` prop in the `<Viewer />` component would accept a few different options, you could pass in your own AuthClient or config and we'd create one for you. We will no longer create an AuthClient for you, as that should be the responsibility of the App, not the Viewer. Instead, you need to provide your own AuthClient that implements a simpler interface.

```tsx
interface ViewerAuthorizationClient {
  getAccessToken(): Promise<AccessToken>;
  readonly onAccessTokenChanged: BeEvent<(token: AccessToken) => void>;
}
```

#### Renamed

- The `contextId` prop has been renamed to `iTwinId`
- The `authConfig` prop has been renamed to `authClient` (see [Authorization](#authorization))

#### Removed

The following props have been removed.

- `uiFrameworkVersion`
- `imjsAppInsightsKey`
- `backend.buddiRegion`
- `buddiRegion.buddiServer`

#### New peer dependencies

- [@itwin/imodels-access-frontend](https://www.npmjs.com/package/@itwin/imodels-access-frontend)
- [@itwin/imodels-client-management](https://www.npmjs.com/package/@itwin/imodels-client-management)
- [@itwin/reality-data-client](https://www.npmjs.com/package/@itwin/reality-data-client)

#### New scopes required

In your [iTwin App registration](https://developer.bentley.com/my-apps/), you'll need update your app to add the following scopes:

- `imodels:read`
- `realitydata:read`

### How to upgrade an exisiting application

- A [codemod](https://github.com/iTwin/codemods) has been developed to help you upgrade your exisitng code from iModel.js@2.x to iTwin.js@3.0.

- Change the version of `@itwin/web-viewer-react` in your package.json to use the `"next"` dist tag, eg:

  ```
    "dependencies": {
      ...
      "@itwin/web-viewer-react": "next",
      ...
    },
  ```

- React to the [breaking changes](#breaking-changes) above.

### Quick start a new application

- iTwin Viewer for Web

  ```sh
  npx create-react-app@latest web-viewer-3 --template @itwin/web-viewer@next --scripts-version @bentley/react-scripts
  ```

### Known issues

- As of `create-react-app@4`, global installations of `create-react-app` are discouraged and can cause issues when bootstrapping a new app from a template. We recommend you uninstall the package using `npm uninstall -g create-react-app` or `yarn global remove create-react-app` to ensure that npx always uses the latest version.

- As of `create-react-app@5`, many users have reported a fatal runtime error, **Uncaught ReferenceError: process is not defined**. This can be resolved by pinning down the version of `react-error-overlay` to `6.0.9`. Please see the following issue for more information, [create-react-app/issues/11773](https://github.com/facebook/create-react-app/issues/11773).

- Missing features:

  - The following features/widgets that are part of the default iTwin Viewer are still under development, and will be added back as they're ready.

    - [] - Tree Widget

    - [] - Property Grid
