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

let accessToken;
let accessTokenChangedListeners = [];

// initialize an oidc user manager
const authConfig = {
  scope:
    "openid profile organization email itwinjs imodels:read realitydata:read",
  client_id: "your-client-id",
  redirect_uri: "http://localhost:3000/signin-callback",
  post_logout_redirect_uri: "http://localhost:3000/",
  authority: "https://ims.bentley.com",
  response_type: "code",
};
const userMgr = new Oidc.UserManager(authConfig);

function notifyListeners() {
  accessTokenChangedListeners.forEach((listener) => {
    listener(accessToken);
  });
}

function userLoggedOut() {
  // user is logged out
  // enable/disable button accordingly
  viewModelButton.setAttribute("disabled", "disabled");
  logoutButton.setAttribute("disabled", "disabled");
  loginButton.removeAttribute("disabled");
}

function userLoggedIn() {
  // user is logged in
  // enable/disable button accordingly
  viewModelButton.removeAttribute("disabled");
  logoutButton.removeAttribute("disabled");
  loginButton.setAttribute("disabled", "disabled");
}

userMgr.events.addUserLoaded((user) => {
  accessToken = `Bearer ${user.access_token}`;
  notifyListeners();
  userLoggedIn();
});

userMgr.events.addUserUnloaded(() => {
  accessToken = undefined;
  notifyListeners();
  userLoggedOut();
});

userMgr.events.addAccessTokenExpired(() => {
  accessToken = undefined;
  notifyListeners();
  userLoggedOut();
});

userMgr.events.addUserSignedOut(() => {
  accessToken = undefined;
  notifyListeners();
  userLoggedOut();
});

userMgr.getUser().then((user) => {
  if (user) {
    accessToken = `Bearer ${user.access_token}`;
    userLoggedIn();
  }
});

async function login() {
  await userMgr.signinRedirect();
}

async function logout() {
  await userMgr.signoutRedirect();
}

function getAccessToken() {
  return accessToken;
}

// create a new instance of the viewer on the "viewerRoot" div and load an iModel in it
async function viewModel() {
  const viewer = new iTwinViewer({
    elementId: "viewerRoot",
    authConfig: {
      getAccessToken: getAccessToken,
      onAccessTokenChanged: {
        addListener: (fn) => {
          accessTokenChangedListeners.push(fn);
          return fn(accessToken);
        },
      },
    },
  });
  if (viewer) {
    viewer.load({
      iTwinId: "1bff8c44-3196-4231-b8f6-66cf6dacd45b",
      iModelId: "563956a0-b0a1-4e0b-b354-541985b0cc62",
    });
  }
}
