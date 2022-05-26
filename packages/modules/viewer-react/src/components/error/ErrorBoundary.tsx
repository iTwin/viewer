/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import type { ErrorPageProps, ErrorPageType } from "@itwin/itwinui-react";
import { ErrorPage } from "@itwin/itwinui-react";
import React, { Component, Fragment } from "react";

interface Props {
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
      let errorType: ErrorPageType = "generic";
      let errorMessage: ErrorPageProps["errorMessage"] = (
        <>
          We can't find the iModel that you are looking for or it does not
          exist. Visit the iModel HUB or contact our support team.
        </>
      );

      if (this.state.error.message) {
        switch (this.state.error.message) {
          case "error401":
            errorType = "401";
            errorMessage = (
              <>
                You do not have permission to access this server.
                <br />
                Unable to fulfill request.
              </>
            );
            break;
          case "error403":
          case "ErrorNoEntitlement":
            errorType = "403";
            errorMessage = (
              <>
                You do not have permission to access this server.
                <br />
                Unable to fulfill request.
              </>
            );
            break;
          case "error404":
            errorType = "404";
            errorMessage = (
              <>
                We can not find the iModel that you are looking for or it does
                not exist.
                <br />
                Visit the iModel HUB or contact our support team.
              </>
            );
            break;
          case "error500":
            errorType = "500";
            errorMessage = (
              <>
                Please retry again. If this continues to happen, please contact
                our support team or visit the iModel HUB.
              </>
            );
            break;
          case "error503":
          case "ConnectFailed":
            errorType = "503";
            errorMessage = (
              <>
                This service is being worked on. Please come back in a little
                bit or visit iModel HUB.
              </>
            );
            break;
          case "MaintenanceMode":
            errorType = "503";
            errorMessage = (
              <>
                This service is being worked on. Please come back in a little
                bit or visit iModel HUB.
              </>
            );
            break;
          default:
            errorType = "generic";
            errorMessage = (
              <>
                We can't find the iModel that you are looking for or it does not
                exist. Visit the iModel HUB or contact our support team.
              </>
            );
            break;
        }
      }

      return (
        <ErrorPage
          errorMessage={errorMessage}
          errorType={errorType}
          primaryButtonHandle={() => {
            console.log("Close");
          }}
          primaryButtonLabel="Close"
          secondaryButtonHandle={() => {
            console.log("Cancel");
          }}
          secondaryButtonLabel="Cancel"
        />
      );
    } else {
      return <Fragment>{this.props.children}</Fragment>;
    }
  }
}
