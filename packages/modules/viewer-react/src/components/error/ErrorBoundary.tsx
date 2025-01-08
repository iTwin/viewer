/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { SvgError } from "@itwin/itwinui-illustrations-react";
import { NonIdealState } from "@itwin/itwinui-react";
import type { PropsWithChildren } from "react";
import React, { Component } from "react";

interface State {
  fallback: boolean;
  error: Error;
}

export class ErrorBoundary extends Component<
  PropsWithChildren<Record<string, unknown>>,
  State
> {
  override state: State = {
    fallback: false,
    error: new Error(),
  };

  static getDerivedStateFromError(e: Error): State {
    return {
      fallback: true,
      error: e,
    };
  }

  override render() {
    if (this.state.fallback) {
      return (
        <NonIdealState svg={<SvgError />} heading={this.state.error.message} />
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}
