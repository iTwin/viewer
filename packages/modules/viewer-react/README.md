# iTwin-React-Viewer

The iTwin Viewer is a configurable iTwin.js viewer that offers basic tooling and widgets out-of-the-box and can be further extended through the use of [iTwin.js UI Providers](https://www.itwinjs.org/learning/ui/augmentingui/). This package contains the base Viewer as a React component and some additional Typescript API's. In most cases, the code in this package should not be consumed directly. Rather, you should opt for the package that corresponds to your application type: [@itwin/web-viewer-react](https://www.npmjs.com/package/@itwin/web-viewer-react) or [@itwin/desktop-viewer-react](https://www.npmjs.com/package/@itwin/desktop-viewer-react).

## React compatibility

Viewer supports React and React DOM 18 and 19. For React 19, use
`@itwin/appui-react` 5.36.0 or later in the 5.x series and
`@itwin/presentation-components` 6.x. Earlier AppUI versions use `findDOMNode`
for docked tool settings. React 19 removed that API.

## Development

When making changes to the src, run `npm start` in the package's root folder to enable source watching and rebuild, so the dev-server will have access to updated code on succesful code compilation.
