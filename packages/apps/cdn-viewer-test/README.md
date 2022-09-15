# Javascript Viewer Sample

This app is an example of using the iTwin Viewer in a pure javascript application. It is meant to be used as a development environment for the components in the packages in this monorepo. It is not intended to be used as a seed/starter application.

## iTwin Viewer

The iTwin Viewer bundle will be hosted and served from a CDN. For development purposes, you can build the viewer and serve it locally on port 3003 in order to run this application. Be sure to update the main.js and main.css src in index.html to the proper url if serving anywhere other than http://localhost:3003.

## Configure the App

Replace the `client_id` in app.js with a client id that contains the scopes and redirect uris that are defined in the same file.

## Starting the App

You can use the http-server package to serve the app. It must be served on port 3000 for the testing oidc client to work properly (i.e. npx http-server -p 3000).
