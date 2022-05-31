/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { ErrorPageProps, ErrorPageType } from "@itwin/itwinui-react";
import { ErrorPage } from "@itwin/itwinui-react";
import React, { Component } from "react";

interface Props {
  eventTitle?: string;
}

interface Error {
  code?: string;
  message?: string;
}

export class ErrorBoundary extends Component<
  Props,
  {
    fallback: boolean;
    error: Error;
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      fallback: false,
      error: {},
    };
  }

  static getDerivedStateFromError(e: Error): {
    fallback: boolean;
    error: Error;
  } {
    return {
      fallback: true,
      error: e,
    };
  }

  override render(): JSX.Element {
    if (this.state.fallback) {
      const errorType: ErrorPageType = "generic";
      let errorMessage: ErrorPageProps["errorMessage"] = (
        <>
          We can't find the iModel that you are looking for or it does not
          exist. Visit the iModelHub or contact our support team.
        </>
      );

      if (this.state.error.message) {
        errorMessage = this.state.error.message;
      }

      return <ErrorPage errorType={errorType} errorMessage={errorMessage} />;
    } else {
      return <>{this.props.children}</>;
    }
  }
}
