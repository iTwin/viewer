# Getting Started with the iTwin Viewer Template for Desktop

This project was scaffolded with [degit](https://github.com/Rich-Harris/degit).

## Environment Variables

Prior to running the app, you will need to add OIDC client configuration to the variables in the .env file:

```
ITWIN_VIEWER_CLIENT_ID="native-xxxxxxxx"
```

- You should generate a [client](https://developer.bentley.com/register/) to get started. The client that you generate should be for a desktop app and use the following list of apis. You can add the default redirect uri (http://localhost:3001/signin-callback).

- Viewer expects the `itwin-platform` scope to be set.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the Electron app in the development mode.\
The page will reload if you make edits.

### `npm run build:backend`

Compiles the backend.

### `npm run build:frontend`

Compiles and bundles the frontend.

### `npm run build`

Builds the app by compiling the backend and compiling & bundling the frontend.

### `npm run preview`

Once you have built the app using `npm run build` you may test it locally by running this command.

This will start the Electron app and serve the frontend from a local static server from `dist` at [http://localhost:3000](http://localhost:3000), allowing you to test the full desktop experience.

### `npm run lint`

Runs ESLint on all source files to check for code style issues and potential errors.

## Next Steps

- There is a sample snapshot file in the "samples" directory that can be used for testing application features

- [iTwin Viewer options](https://www.npmjs.com/package/@itwin/desktop-viewer-react)

- [Extending the iTwin Viewer](https://www.itwinjs.org/learning/tutorials/hello-world-viewer/)

- [Using the iTwin Platform](https://developer.bentley.com/)

- [iTwin Developer Program](https://www.youtube.com/playlist?list=PL6YCKeNfXXd_dXq4u9vtSFfsP3OTVcL8N)