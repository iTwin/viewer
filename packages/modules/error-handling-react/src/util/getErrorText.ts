/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ApolloError } from "apollo-client";

import { iTwinErrorI18n } from "./i18n";

/**
 * This will interpret ApolloErrors to generate a readable text message
 * or return the message property of any other object, if present.
 * @param error ApolloError | Error |any
 */
export const getErrorText = (error: ApolloError | any | undefined): string => {
  const defaultError = iTwinErrorI18n.t("GraphQl.errors.defaultError");
  if (error) {
    if (error.graphQLErrors?.length > 0) {
      return error.graphQLErrors[0].message;
    }
    if (error.networkError?.result?.errors?.length > 0) {
      if (error.networkError.result.errors[0]?.extensions?.code === "401") {
        return iTwinErrorI18n.t("GraphQl.errors.unauthorizedError");
      } else {
        return error.networkError.result.errors[0].message;
      }
    }
    if (error.message) {
      return error.message;
    }
  }
  return defaultError;
};
