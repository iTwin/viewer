# iTwin-React-Viewer

The iTwin Viewer is a configurable iModel.js viewer that offers basic tooling and widgets out-of-the-box and can be further extended through the use of [iModel.js extensions](https://github.com/imodeljs/extension-sample) and/or [UI Providers](https://www.itwinjs.org/learning/ui/augmentingui/). This package contains the base Viewer as a React component and some additional Typescript API's. In most cases, the code in this package should not be consumed directly. Rather, you should opt for the package that corresponds to your application type: [@itwin/web-viewer-react](https://github.com/itwin/viewer/tree/main/packages/modules/web-viewer-react) or [@itwin/desktop-viewer-react](https://github.com/itwin/viewer/tree/main/packages/modules/desktop-viewer-react).

# Development

When making changes to the src, run `npm start` in the dev folder to enable source watching and rebuild, so the dev-server will have access to updated code on succesful code compilation.
