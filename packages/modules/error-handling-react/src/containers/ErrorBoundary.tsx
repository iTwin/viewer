/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import React, { Component, Fragment } from "react";

import { EventTrackerFunction } from "..";
import { Fallback } from "./Fallback";

interface Props {
  Fallback?: typeof Fallback;
  eventTracker?: EventTrackerFunction;
  eventTitle?: string;
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
      error: new Error(),
    };
  }

  static getDerivedStateFromError(
    e: Error
  ): { fallback: boolean; error: Error } {
    return {
      fallback: true,
      error: e,
    };
  }

  render(): JSX.Element {
    if (this.state.fallback) {
      const Component = this.props.Fallback ?? Fallback;
      return (
        <Component
          message={this.state.error.message}
          eventTracker={this.props.eventTracker}
          eventTitle={this.props.eventTitle}
        />
      );
    } else {
      return <Fragment>{this.props.children}</Fragment>;
    }
  }
}
