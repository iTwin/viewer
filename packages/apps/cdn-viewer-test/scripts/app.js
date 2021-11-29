// Copyright (c) Bentley Systems, Incorporated. All rights reserved.

/*global Oidc, iTwinViewer*/

// add click event handlers and set initial state of buttons
const loginButton = document.getElementById("login");
loginButton.addEventListener("click", login, false);

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener("click", logout, false);
logoutButton.setAttribute("disabled", "disabled");

const viewModelButton = document.getElementById("viewModel");
viewModelButton.addEventListener("click", viewModel, false);
viewModelButton.setAttribute("disabled", "disabled");

// initialize an oidc user manager
const authConfig = {
  scope:
    "openid email profile organization imodelhub context-registry-service:read-only product-settings-service general-purpose-imodeljs-backend imodeljs-router",
  client_id: "imodeljs-spa-samples-2686",
  redirect_uri: "http://localhost:3000/signin-callback.html",
  post_logout_redirect_uri: "http://localhost:3000/",
  authority: "https://imsoidc.bentley.com",
  response_type: "code",
};
const userMgr = new Oidc.UserManager(authConfig);

userMgr.getUser().then((user) => {
  if (user) {
    // user is logged in
    // enable/disable button accordingly
    viewModelButton.removeAttribute("disabled");
    logoutButton.removeAttribute("disabled");
    loginButton.setAttribute("disabled", "disabled");
  }
});

function getUserManager() {
  return userMgr;
}

async function login() {
  await userMgr.signinRedirect();
}

async function logout() {
  await userMgr.signoutRedirect();
}

// create a new instance of the viewer on the "viewerRoot" div and load an iModel in it
async function viewModel() {
  const viewer = new iTwinViewer({
    elementId: "viewerRoot",
    authConfig: {
      getUserManagerFunction: getUserManager,
    },
  });
  if (viewer) {
    viewer.load({
      iTwinId: "1bff8c44-3196-4231-b8f6-66cf6dacd45b",
      iModelId: "563956a0-b0a1-4e0b-b354-541985b0cc62"
    });
  }
}
