/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./ToastStyling.scss";

import * as React from "react";

import type { IToastLink } from "./Toast";
import Toast from "./Toast";

/* Keep track of each toast's ID and pass isVisible prop into
 *  the Toast component in order to animate properly
 */
export interface IToastObject extends IToastSettings {
  id: number;
  isVisible: boolean;
}

/* Props for Toast component */
export interface IToastSettings {
  text: string;
  category: "informational" | "error" | "success";
  type: "persisting" | "temporary";
  link?: IToastLink;
  hasCloseButton?: boolean;
  duration?: number;
}

/* Bind functions from Toaster*/
interface IProps {
  bindNotify: (
    notifyFunction: (settings: IToastSettings) => IToastObject
  ) => void;
  bindCloseAll: (notifyFunction: () => void) => void;
}

interface IState {
  toasts: IToastObject[];
}

export default class ToastMaster extends React.Component<IProps, IState> {
  private static idCounter = 0;

  constructor(props: IProps) {
    super(props);

    this.notify = this.notify.bind(this);
    this.closeAll = this.closeAll.bind(this);

    props.bindNotify(this.notify);
    props.bindCloseAll(this.closeAll);
    this.state = {
      toasts: [],
    };

    this.createToastInstance = this.createToastInstance.bind(this);
    this.removeToast = this.removeToast.bind(this);
  }

  /* Remove the specified toast from the state*/
  public removeToast(id: number): void {
    this.setState((prevState) => {
      return {
        toasts: prevState.toasts.filter((toast) => toast.id !== id),
      };
    });
  }

  /* Set isVisible to false in the specified Toast using ID*/
  public closeToast(id: number): void {
    this.setState((prevState) => {
      return {
        toasts: prevState.toasts.map((toast) => {
          if (toast.id === id) {
            return {
              ...toast,
              isVisible: false,
            };
          }
          return toast;
        }),
      };
    });
  }

  public render(): JSX.Element {
    return (
      <span className="itwin-toast-wrapper">
        {this.state.toasts.map(({ id, ...props }) => {
          return (
            <Toast
              key={id}
              onRemove={this.removeToast.bind(this, id)}
              {...props}
            />
          );
        })}
      </span>
    );
  }

  /* Return a ToastObject and add it into the state */
  private notify(settings: IToastSettings): IToastObject {
    const instance = this.createToastInstance(settings);

    this.setState((prevState) => {
      return {
        toasts: [instance, ...prevState.toasts],
      };
    });
    return instance;
  }

  /* Set isVisible to false for every toast in the state*/
  private closeAll() {
    this.state.toasts.forEach((toast) => {
      this.closeToast(toast.id);
    });
  }

  /* Create a ToastObject using settings passed in from Toaster */
  private createToastInstance(settings: IToastSettings): IToastObject {
    const uid = ++ToastMaster.idCounter;
    return {
      category: settings.category,
      duration: settings.duration,
      hasCloseButton: settings.hasCloseButton,
      id: uid,
      isVisible: true,
      link: settings.link,
      text: settings.text,
      type: settings.type,
    };
  }
}
