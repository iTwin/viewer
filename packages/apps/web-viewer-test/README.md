# React Viewer Sample

This app is an example of using the iTwin Viewer in a modularized React application. It is meant to be used as a development environment for the components in the packages in this monorepo. It is not intended to be used as a seed/starter application. You should use the [iTwin Web Viewer Template](https://github.com/itwin/viewer/tree/main/packages/templates/web) to seed a new application.

This project was built with [Vite](https://github.com/vitejs/vite).

## Configuration

Prior to running or building the application, you should update the environment variables in the .env file as needed. This should include adding a valid iTwinId and iModelId as well as updating the authorization client and backend configuration as needed. For the `IMJS_AUTH_CLIENT_CLIENT_ID` variable, you should [generate a new client](https://www.itwinjs.org/getting-started/registration-dashboard?tab=0) or use an existing valid client id. This can be stored in a .env.local file alongside the .env file so that it will be persisted for you locally but not committed to the remote repo.

## Available Scripts

In the project directory, you can run:

### `rushx start`

Runs the app in the development mode.<br />
It automatically opens [http://localhost:3000](http://localhost:3000) in your default browser.

The page will reload if you make edits.<br />

## Learn More

[Learn React](https://reactjs.org/).

[Learn iTwin.js](https://www.itwinjs.org/learning/).
