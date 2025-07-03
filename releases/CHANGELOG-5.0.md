# iTwin Viewer 5.0

## Breaking changes

### Removed

The following prop(s) have been removed from the  `<Viewer />` component:

- `theme`
  - please wrap the `<Viewer />` component with `ThemeProvider` from `@itwin/itwinui-react` instead

- `backstageItems`
  - please provide a `Backstage` through [UiItemsProvider.provideBackstageItems](https://www.itwinjs.org/reference/appui-react/uiprovider/uiitemsprovider/).

- `getSchemaContext`
  - `schemaContext` has been added to `iModelConnection`

We have also dropped support for `CommonJs` modules. Please use `ESM` instead.

### Updated minimum versions

- The minimum `iTwin.js Core` versions have been updated to `^5.0.0`, please see their [changelog](https://github.com/iTwin/itwinjs-core/blob/master/docs/changehistory/5.0.0.md) for more details.
- The minimum `AppUI` versions have been updated to `^5.5.0`, please see their [changelog](https://github.com/iTwin/appui/releases) for more details.
- The minimum `imodels-*` versions have been updated to `^6.0.1`, please see their [changelog](https://github.com/iTwin/imodels-clients/blob/main/itwin-platform-access/imodels-access-frontend/CHANGELOG.md) for more details.
- The minimum `electron` version for the desktop-viewer has been updated to `^36.0.0`, please see their [changelog](https://www.electronjs.org/docs/latest/breaking-changes) for more details.
- The minimum version of `redux` and `react-redux` has been updated to `^5.0.0` and `^9.0.0` respectively. Please see their respective changelogs for more details.
- Now deliver `ES2023`