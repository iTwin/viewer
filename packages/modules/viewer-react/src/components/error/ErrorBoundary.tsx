/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ErrorPage } from "@itwin/itwinui-react";
import React, { Component } from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  fallback: boolean;
  error: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  override state = {
    fallback: false,
    error: new Error(),
  };

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
      return (
        <ErrorPage
          errorType="generic"
          errorMessage={this.state.error.message}
        />
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}
