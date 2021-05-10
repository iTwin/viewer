# Javascript Viewer Sample

This app is an example of using the iTwin Viewer in a pure javascript application.

## iTwinViewer

The iTwin Viewer bundle will be hosted and served from a CDN. For development purposes, you can build the viewer and serve it locally on port 3003 in order to run this application. Be sure to update the main.js and main.css src in index.html to the proper url if serving anywhere other than http://localhost:3003.

## Starting the App

You can use the http-server package to serve the app. It must be served on port 3000 for the testing oidc client to work properly (i.e. npx http-server -p 3000).
