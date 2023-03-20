/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import * as React from "react";
import ReactDOM from "react-dom";

import type { IToastLink } from "./Toast";
import type { IToastObject, IToastSettings } from "./ToastMaster";
import ToastMaster from "./ToastMaster";

type IToastOptions = {
  duration?: number;
  hasCloseButton?: boolean;
  type?: "persisting" | "temporary";
  link?: IToastLink;
};

export default class Toaster {
  public notifyHandler: ((settings: IToastSettings) => IToastObject) | null;
  public closeAllHandler: (() => void) | null;

  constructor() {
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.informational = this.informational.bind(this);

    this.notifyHandler = null;
    this.closeAllHandler = null;
    this._bindNotify = this._bindNotify.bind(this);
    this._bindCloseAll = this._bindCloseAll.bind(this);

    const container = document.createElement("div");
    container.setAttribute("itwin-toaster-container", "");
    document.body.appendChild(container);
    ReactDOM.render(
      <ToastMaster
        bindNotify={this._bindNotify}
        bindCloseAll={this._bindCloseAll}
      />,
      container
    );
  }

  /* Call a Toast component with the success category */
  public success(text: string, settings?: IToastOptions): void {
    if (this.notifyHandler) {
      this.notifyHandler({
        category: "success",
        duration: settings && settings.duration ? settings.duration : undefined,
        hasCloseButton:
          settings && settings.hasCloseButton
            ? settings.hasCloseButton
            : undefined,
        link: settings && settings.link ? settings.link : undefined,
        text,
        type: settings && settings.type ? settings.type : "persisting",
      });
    }
  }

  /* Call a Toast component with the informational category */
  public informational(text: string, settings?: IToastOptions): void {
    if (this.notifyHandler) {
      this.notifyHandler({
        category: "informational",
        duration: settings && settings.duration ? settings.duration : undefined,
        hasCloseButton:
          settings && settings.hasCloseButton
            ? settings.hasCloseButton
            : undefined,
        link: settings && settings.link ? settings.link : undefined,
        text,
        type: settings && settings.type ? settings.type : "persisting",
      });
    }
  }

  /* Call a Toast component with the error category */
  public error(text: string, settings?: IToastOptions): void {
    if (this.notifyHandler) {
      this.notifyHandler({
        category: "error",
        duration: settings && settings.duration ? settings.duration : undefined,
        hasCloseButton:
          settings && settings.hasCloseButton
            ? settings.hasCloseButton
            : undefined,
        link: settings && settings.link ? settings.link : undefined,
        text,
        type: settings && settings.type ? settings.type : "persisting",
      });
    }
  }

  /* Call closeAll from ToastManager */
  public closeAll(): void {
    if (this.closeAllHandler) {
      this.closeAllHandler();
    }
  }

  /* Bind the notify function from ToastManager */
  private _bindNotify(notify: (settings: IToastSettings) => IToastObject) {
    this.notifyHandler = notify;
  }

  /* Bind the closeAll function from ToastManager */
  private _bindCloseAll(closeAll: () => void) {
    this.closeAllHandler = closeAll;
  }
}
