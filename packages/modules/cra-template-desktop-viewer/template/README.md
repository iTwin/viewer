# Getting Started with the iTwin Viewer Create React App Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Prior to running the app, you will need to add OIDC client configuration to the variables in the .env file:

```
ITWIN_VIEWER_CLIENT_ID="native-xxxxxxxx"
```

- You should generate a [client](https://developer.bentley.com/register/) to get started. The client that you generate should be for a desktop app and use the Visualization apis. You can add the default redirect uri (http://localhost:3000/signin-callback).

- You may also replace the path of the sample snapshot with one of your own local snapshots in the following variable:

```
ITWIN_VIEWER_SNAPSHOT="./path/to/my/snapshot"
```

This will load the snapshot in the Viewer by default.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the Electron app in the development mode.\
The page will reload if you make edits.

### `npm run build:backend`

Compiles the backend.

### `npm run build:frontend`

Compiles and bundles the frontend.

## Next Steps

- [iTwin Viewer options](https://www.npmjs.com/package/@itwin/desktop-viewer-react)

- [Extending the iTwin Viewer](https://www.itwinjs.org/learning/tutorials/hello-world-viewer/)

- [Using the iTwin Platform](https://developer.bentley.com/)

- [iTwin Developer Program](https://www.youtube.com/playlist?list=PL6YCKeNfXXd_dXq4u9vtSFfsP3OTVcL8N)
