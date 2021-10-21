# Desktop Viewer Sample

This app is an example of using the iTwin Viewer in a modularized React + Electron desktop application. It is meant to be used as a development environment for the components in the packages in this monorepo. It is not intended to be used as a seed/starter application. You should use the [Create React App template](https://www.npmjs.com/package/@itwin/cra-template-desktop-viewer-3.0) to seed a new application.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Configuration

Prior to running or building the application, you should add a valid OIDC client id so the `ITWIN_VIEWER_CLIENT_ID` variable in the .env file or in a .env.local file. You can generate a client [here](https://developer.bentley.com/register/). Ensure that your client is a "Desktop/Mobile" type and uses the Visualization API association.

## Available Scripts

In the project directory, you can run:

### `rushx start`

Runs the app in the development mode. It should open the app in a new Electron window<br />

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Learn More

[Learn React](https://reactjs.org/).

[Learn Electron.js](https://www.electronjs.org/docs/tutorial/quick-start).

[Learn iTwin.js](https://www.itwinjs.org/learning/).
