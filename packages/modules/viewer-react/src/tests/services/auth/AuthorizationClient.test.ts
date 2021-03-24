/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import AuthorizationClient from "../../../services/auth/AuthorizationClient";
import MockOidcClient from "../../mocks/MockOidcClient";

describe("AuthorizationClient", () => {
  it("initializes iModel.js client properties properly", () => {
    const oidcClient = new MockOidcClient();
    const authClient = new AuthorizationClient(oidcClient.getUserManager);
    expect(authClient.hasExpired).toEqual(true);
    expect(authClient.hasSignedIn).toEqual(true);
    expect(authClient.isAuthorized).toEqual(false);
  });
});
