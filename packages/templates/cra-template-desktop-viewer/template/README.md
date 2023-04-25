# Getting Started with the iTwin Viewer Create React App Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Prior to running the app, you will need to add OIDC client configuration to the variables in the .env file:

```
ITWIN_VIEWER_CLIENT_ID="native-xxxxxxxx"
```

- You should generate a [client](https://developer.bentley.com/register/) to get started. The client that you generate should be for a desktop app and use the following list of apis. You can add the default redirect uri (http://localhost:3000/signin-callback).

- Scopes expected by the viewer are:

  - **Visualization**: `imodelaccess:read`
  - **iModels**: `imodels:read`
  - **Reality Data**: `realitydata:read`
  - **Projects**: `projects:read`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the Electron app in the development mode.\
The page will reload if you make edits.

### `npm run build:backend`

Compiles the backend.

### `npm run build:frontend`

Compiles and bundles the frontend.

## Notes

If you are not using NPM, remove the `USING_NPM` env var from [.env](./.env)

## Next Steps

- There is a sample snapshot file in the "samples" directory that can be used for testing application features

- [iTwin Viewer options](https://www.npmjs.com/package/@itwin/desktop-viewer-react)

- [Extending the iTwin Viewer](https://www.itwinjs.org/learning/tutorials/hello-world-viewer/)

- [Using the iTwin Platform](https://developer.bentley.com/)

- [iTwin Developer Program](https://www.youtube.com/playlist?list=PL6YCKeNfXXd_dXq4u9vtSFfsP3OTVcL8N)
