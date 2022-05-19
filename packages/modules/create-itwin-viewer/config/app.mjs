export const appConfiguration = {
  common: {
    auth: {
      authority: "https://ims.bentley.com",
      clientId: "",
      redirectUri: "http://localhost:3000/signin-callback",
      postSignoutRedirectUri: "http://localhost:3000/logout",
    },
  },
  web: {
    auth: {
      scope: "imodelaccess:read imodels:read realitydata:read",
    },
  },
  desktop: {
    auth: {
      scope:
        "imodelaccess:read offline_access imodels:read projects:read realitydata:read",
    },
  },
};
