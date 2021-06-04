# iTwin Viewer

The iTwin Viewer is an iTwin model viewer that can be embedded in a web application via a script tag.

## Building the viewer

After making your changes, build the viewer by running "yarn build" from the iTwinViewer directory.

## Testing your changes

The cdn-viewer-test app can be used to test your changes:

1. After building the iTwinViewer, [serve the contents of the build directory on port 3003 with any node.js http server](https://create-react-app.dev/docs/deployment/).

2. Serve the cdn-viewer-test app (apps/cdn-viewer-test) with the http-server package on port 3000 (i.e. npx http-server -p 3000).
