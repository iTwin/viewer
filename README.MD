# iTwin Viewer

Copyright © Bentley Systems, Incorporated. All rights reserved.

The iTwin Viewer is a configurable iTwin.js viewer. This monorepo contains the iTwin Viewer npm packages, as well as sample applications to provide examples of their usage. Each package in the repository contains a README with specific information pertaining to the package.

| Name                               | Folder                                                                                         | Description                                                      | Version                                                                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| @itwin/viewer-react                | [packages/modules/viewer-react](packages/modules/viewer-react)                                 | Contains the base iTwin Viewer React component                   | [![npm version](https://badge.fury.io/js/%40itwin%2Fviewer-react.svg)](https://badge.fury.io/js/%40itwin%2Fviewer-react)                               |
| @itwin/desktop-viewer-react        | [packages/modules/desktop-viewer-react](packages/modules/desktop-viewer-react)                 | Contains the desktop version of the iTwin Viewer React component | [![npm version](https://badge.fury.io/js/%40itwin%2Fdesktop-viewer-react.svg)](https://badge.fury.io/js/%40itwin%2Fdesktop-viewer-react)               |
| @itwin/web-viewer-react            | [packages/modules/web-viewer-react](packages/modules/web-viewer-react)                         | Contains the web version of the iTwin Viewer React component     | [![npm version](https://badge.fury.io/js/%40itwin%2Fweb-viewer-react.svg)](https://badge.fury.io/js/%40itwin%2Fweb-viewer-react)                       |
| itwin-web-viewer-template     | [packages/templates/web](packages/templates/web)         | [Template that contains the iTwin Web Viewer](#itwin-viewer-template-for-web-using-vite)                  | Not Published to npm        |
| @itwin/cra-template-desktop-viewer | [packages/templates/cra-template-desktop-viewer](packages/templates/cra-template-desktop-viewer) | CRA Template that contains the iTwin Desktop Viewer              | [![npm version](https://badge.fury.io/js/%40itwin%2Fcra-template-desktop-viewer.svg)](https://badge.fury.io/js/%40itwin%2Fcra-template-desktop-viewer) |

# iTwin Viewer Template for Web using Vite

This is a template for web applications that are based on the [iTwin Viewer](https://github.com/itwin/viewer/tree/main/packages/modules/web-viewer-react) built using [Vite](https://github.com/vitejs/vite).

To create a new app based on this template run:

```sh
npx degit iTwin/viewer/packages/templates/web#master my-app-name
```

Note: If you're using the template directly from this repository, you might notice missing icons when running the app with pnpm start. To resolve this, run:

```sh
pnpm run build && pnpm run preview
```
This ensure that the icons render correctly.

## Contributing

For information on how to contribute to this project, please read [CONTRIBUTING](CONTRIBUTING.MD).
