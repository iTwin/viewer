/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ApolloError } from "apollo-client";

import { getErrorText } from "../../util/getErrorText";
import { iTwinErrorI18n } from "../../util/i18n";

const graphQLError = new Error("GRAPHQL_ERROR_1") as any;
const networkError401 = new Error("NETWORK_ERROR_401") as any;
networkError401.result = { errors: [{ extensions: { code: "401" } }] };
const networkErrorOther = new Error("NETWORK_ERROR_OTHER") as any;
networkErrorOther.result = { errors: [{ message: "OTHER_NETWORK_ERROR" }] };
const networkErrorUnknown = new Error("NETWORK_ERROR_UNKNOWN") as any;
const otherError = new Error("OTHER_ERROR");

describe("getErrorText", () => {
  it("return first GraphQLError message if there is one", () => {
    const error = new ApolloError({
      graphQLErrors: [graphQLError],
      networkError: networkErrorOther,
    });

    const test = getErrorText(error);

    expect(test).toEqual(graphQLError.message);
  });

  it("return networkError 401 message if first code is 401", () => {
    const error = new ApolloError({
      networkError: networkError401,
    });

    const test = getErrorText(error);

    expect(test).toEqual(iTwinErrorI18n.t("GraphQl.errors.unauthorizedError"));
  });

  it("return networkError result message if first code is not 401", () => {
    const error = new ApolloError({
      networkError: networkErrorOther,
    });

    const test = getErrorText(error);

    expect(test).toEqual("OTHER_NETWORK_ERROR");
  });

  it("return networkError message no result is present", () => {
    const error = new ApolloError({
      networkError: networkErrorUnknown,
    });

    const test = getErrorText(error);

    expect(test).toEqual(expect.stringContaining("NETWORK_ERROR_UNKNOWN"));
  });

  it("return Error message for normal errors", () => {
    const test = getErrorText(otherError);

    expect(test).toEqual("OTHER_ERROR");
  });

  it("return defaultError if no other error can be found", () => {
    const error = new ApolloError({});

    const test = getErrorText(error);

    expect(test).toEqual(iTwinErrorI18n.t("GraphQl.errors.defaultError"));
  });
});
