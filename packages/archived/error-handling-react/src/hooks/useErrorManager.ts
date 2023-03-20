/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import type { TFunction } from "i18next";
import { useCallback, useEffect, useState } from "react";

import type { ToastPermanence } from "../components/toaster/ThemedToaster";
import { Toaster } from "../components/toaster/ThemedToaster";
import type { EventTrackerFunction } from "../types";

export interface ErrorManagerOptions<T> {
  t?: TFunction;
  eventTracker?: EventTrackerFunction<T>;
  toastMessageTKey?: string;
  trackErrorEvent?: T;
  trackSuccessEvent?: T;
  toastPermanence?: ToastPermanence;
  toastLink?: {
    text: string;
    callback?: () => void;
    url?: string;
  };
  toastClosable?: boolean;
  toastDuration?: number;
}

export interface ReturnToastOptions {
  messageTKey?: string;
  translationCtx?: any;
  telemetryCtx?: any;
}

export type ThrowToastOptions = ReturnToastOptions;

/** a React hook for managing an error state */
export const useErrorManager: <T>(props: ErrorManagerOptions<T>) => {
  fatalError: Error | undefined;
  throwFatalError: (arg?: string | Error | undefined) => void;
  throwToast: (error: Error, throwOpts?: ReturnToastOptions) => void;
  returnToast: (returnOpts?: ReturnToastOptions) => void;
  catch: (promise: Promise<any>, opts?: ReturnToastOptions) => void;
} = ({ t, eventTracker, ...managerOpts } = {}) => {
  useEffect(() => {
    if (
      (managerOpts.trackErrorEvent || managerOpts.trackSuccessEvent) &&
      !eventTracker
    ) {
      console.warn(
        "useErrorManager: eventTracker must be provided along trackErrorEvent or trackSuccessEvent"
      );
    }
  }, [
    managerOpts.trackErrorEvent,
    managerOpts.trackSuccessEvent,
    eventTracker,
  ]);

  useEffect(() => {
    if (managerOpts.toastMessageTKey && !t) {
      console.warn(
        "useErrorManager: t must be provided along toastMessageTKey"
      );
    }
  }, [managerOpts.toastMessageTKey, t]);

  const [fatalError, setFatalError] = useState<Error>();
  const throwFatalError = (arg?: string | Error) => {
    if (arg instanceof Error) {
      setFatalError(arg);
    } else {
      setFatalError(new Error(arg));
    }
  };

  /** post a return (aka success) toast */
  const returnToast = useCallback(
    (returnOpts: ThrowToastOptions = {}) => {
      if (returnOpts.messageTKey && !t) {
        console.warn(
          "useErrorManager: t must be provided at hook initialisation when providing returnToast with messageTKey"
        );
      }

      const messageTKey =
        returnOpts.messageTKey ?? managerOpts.toastMessageTKey;
      if (messageTKey && t) {
        const linkProps =
          managerOpts.toastLink &&
          // either callback or url must be defined
          (managerOpts.toastLink.callback || managerOpts.toastLink.url)
            ? managerOpts.toastLink
            : undefined;
        Toaster.success(t(messageTKey, returnOpts.translationCtx), {
          duration: managerOpts.toastDuration,
          hasCloseButton:
            managerOpts.toastClosable !== undefined
              ? managerOpts.toastClosable
              : true,
          type: managerOpts.toastPermanence ?? "temporary",
          link: linkProps && {
            title: linkProps.text,
            url: linkProps.callback ?? linkProps.url ?? "", // "" is unreachable
          },
        });
      }
      if (managerOpts.trackSuccessEvent && eventTracker) {
        eventTracker(managerOpts.trackSuccessEvent, returnOpts.telemetryCtx);
      }
    },
    [managerOpts, t, eventTracker]
  );

  const throwToast = useCallback(
    (error: Error, throwOpts: ThrowToastOptions = {}) => {
      if (throwOpts.messageTKey && !t) {
        console.warn(
          "useErrorManager: t must be provided at hook initialisation when providing throwToast with messageTKey"
        );
      }
      console.error(error);
      const messageTKey = throwOpts.messageTKey ?? managerOpts.toastMessageTKey;
      if (messageTKey && t) {
        const linkProps =
          managerOpts.toastLink &&
          // either callback or url must be defined
          (managerOpts.toastLink.callback || managerOpts.toastLink.url)
            ? managerOpts.toastLink
            : undefined;
        Toaster.error(t(messageTKey, throwOpts.translationCtx), {
          duration: managerOpts.toastDuration,
          hasCloseButton:
            managerOpts.toastClosable !== undefined
              ? managerOpts.toastClosable
              : true,
          type: managerOpts.toastPermanence ?? "temporary",
          link: linkProps && {
            title: linkProps.text,
            url: linkProps.callback ?? linkProps.url ?? "", // "" is unreachable
          },
        });
      }
      if (managerOpts.trackErrorEvent && eventTracker) {
        eventTracker(managerOpts.trackErrorEvent, throwOpts.telemetryCtx);
      }
    },
    [managerOpts, t, eventTracker]
  );

  const catch_ = useCallback(
    (promise: Promise<any>, opts: ThrowToastOptions = {}) => {
      promise.catch((err) => throwToast(err, opts));
    },
    [throwToast]
  );

  return {
    fatalError,
    throwFatalError,
    throwToast,
    returnToast,
    catch: catch_,
  };
};
