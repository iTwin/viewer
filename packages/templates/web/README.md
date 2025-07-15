# Getting Started with the iTwin Viewer Template

This project was scaffolded with [degit](https://github.com/Rich-Harris/degit).

## Environment Variables

Prior to running the app, you will need to add OIDC client configuration to the variables in the .env file:

```
# ---- Authorization Client Settings ----
IMJS_AUTH_CLIENT_CLIENT_ID=""
IMJS_AUTH_CLIENT_REDIRECT_URI=""
IMJS_AUTH_CLIENT_LOGOUT_URI=""
IMJS_AUTH_CLIENT_SCOPES=""
```

- You can generate a [test client](https://developer.bentley.com/tutorials/web-application-quick-start/#3-register-an-application) to get started.

- Viewer expects the `itwin-platform` scope to be set.

- The application will use the path of the redirect URI to handle the redirection, it must simply match what is defined in your client.

- When you are ready to build a production application, [register here](https://developer.bentley.com/register/).

You should also add a valid iTwinId and iModelId for your user in the this file:

```
# ---- Test ids ----
IMJS_ITWIN_ID = ""
IMJS_IMODEL_ID = ""
```

- For the IMJS_ITWIN_ID variable, you can use the id of one of your existing iTwins. You can obtain their ids via the [iTwin REST APIs](https://developer.bentley.com/apis/itwins/operations/get-itwin/).

- For the IMJS_IMODEL_ID variable, use the id of an iModel that belongs to the iTwin that you specified in the IMJS_ITWIN_ID variable. You can obtain iModel ids via the [iModel REST APIs](https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-details/).

- Alternatively, you can [generate a test iModel](https://developer.bentley.com/tutorials/web-application-quick-start/#4-create-an-imodel) to get started without an existing iModel.

- If at any time you wish to change the iModel that you are viewing, you can change the values of the iTwinId or iModelId query parameters in the url (i.e. localhost:3000?iTwinId=myNewITwinId&iModelId=myNewIModelId)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
It automatically opens [http://localhost:3000](http://localhost:3000) in your default browser.

The page will reload if you make edits.\

### `npm run build`

Builds the app for production to the `dist` folder.\
It bundles your code in production mode and applies optimizations for best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://vite.dev/guide/static-deploy.html) for more information.

### `npm run preview`

Once you have built the app using `npm run build` you may test it locally by running this command.

This will boot up a local static web server that serves the files from `dist` at [http://localhost:3000](http://localhost:3000).

### `npm run lint`

Runs ESLint on all source files to check for code style issues and potential errors.

## Next Steps

- [iTwin Viewer options](https://www.npmjs.com/package/@itwin/web-viewer-react)

- [Extending the iTwin Viewer](https://developer.bentley.com/tutorials/itwin-viewer-hello-world/)

- [Using the iTwin Platform](https://developer.bentley.com/)

- [iTwin Developer Program](https://www.youtube.com/playlist?list=PL6YCKeNfXXd_dXq4u9vtSFfsP3OTVcL8N)
