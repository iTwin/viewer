export const appConfiguration = {
  auth: {
    authority: "https://ims.bentley.com",
    clientId: "",
    scope: "imodelaccess:read imodels:read realitydata:read",
    redirectUri: "http://localhost:3000/signin-callback",
    postSignoutRedirectUri: "http://localhost:3000/logout",
  },
};
