/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./ToastStyling.scss";

import * as React from "react";
import { Transition } from "react-transition-group";

import {
  Close,
  ErrorHollow,
  InfoHollow,
  SuccessHollow,
} from "../../images/components";

/**
 * View Message of the Toast Notification
 */
export type IToastLink = {
  /**
   *  Either the URL to be novaigated to, or the callback to be executed when clicking the <a> tag.
   */
  url: (() => void) | string;
  /**
   * Text of the <a> tag
   */
  title: string;
};

/**
 *  Toast Property Interface
 */
export type IToastProps = {
  /**
   * Text of the Notification Message
   */
  text: string;
  /**
   * Category of the Toast, which controls the border color, as well as the category icon.
   */
  category: "informational" | "error" | "success";
  /**
   * The Type of the Toast.
   * Persisting Toasts will not be closed automatically, and will contain a close button.
   * Temporary Toasts will automatically close after 7 seconds and will not contain a close button.
   */
  type: "persisting" | "temporary";
  /**
   * Boolean indicating when the toast is visible.
   * When false, will close the Toast and call onRemove when finished closing.
   */
  isVisible: boolean;
  /**
   * Duration of the toast.
   * By default, the toast will close after 7 seconds.
   */
  duration?: number;
  /**
   * Boolean indicating when the close button is visible.
   * When false, the toast will not have any close button.
   */
  hasCloseButton?: boolean;
  /**
   * A URL or Callback that can be used to add additional information to a Toast
   */
  link?: IToastLink;
  /**
   * Function called when the toast is all the way closed.
   */
  onRemove?: () => void;
};

/**
 * Toast Property States
 */
type IToastState = {
  isVisible: boolean;
  height: number;
};

/**
 * Generic Toast Notification Component
 * +++++
 * <Toast type="persisting" text="Job processing completed." category="success" link={{url:() => {alert("Link callback")}, title:"View the report"}} />
 * <Toast type="temporary" text="Processing completed." category="success" />
 * <Toast type="persisting" text="Bacon ipsum dolor amet shoulder andouille meatball meatloaf chicken pork loin alcatra boudin pig beef ribs. Short loin short ribs buffalo shankle, jerky fatback leberkas meatball boudin. Kevin meatloaf flank pancetta, picanha tail kielbasa salami ham hock sirloin cow frankfurter capicola. Jowl shankle short ribs rump shank ribeye, frankfurter sausage." category="informational" link={{url:"http://ux.bentley.com/bwc/react/", title:"View"}} />
 * <Toast type="temporary" text="26 files are available for synchonization." category="informational" />
 * <Toast type="persisting" text="Job processing error." category="error" />
 */
export class Toast extends React.Component<IToastProps, IToastState> {
  private closeTimeout: NodeJS.Timeout | null;

  constructor(props: IToastProps) {
    super(props);
    this.state = {
      height: 0,
      isVisible: true,
    };
    this.closeTimeout = null;

    this.close = this.close.bind(this);
    this.setCloseTimeout = this.setCloseTimeout.bind(this);
    this.onRef = this.onRef.bind(this);
  }

  public render(): JSX.Element {
    const { text, category, type, hasCloseButton, link } = this.props;
    return (
      <Transition
        timeout={240}
        in={this.state.isVisible}
        appear={true}
        unmountOnExit={true}
        onExited={this.props.onRemove}
      >
        {(state) => (
          <div
            className={`itwin-toast-all itwin-toast-${state}`}
            style={{
              height: this.state.height,
              marginBottom: this.state.isVisible ? "0" : -this.state.height,
            }}
          >
            <div ref={this.onRef} style={{ padding: "0px 16px 16px 16px" }}>
              <div className={`itwin-toast-${category}`}>
                <div className="status-icon-container">
                  <div className={"status-icon-background"}>
                    {this.getCategoryIcon()}
                  </div>
                </div>
                <div className="message">{text}</div>
                {link && (
                  <div className="link">
                    {typeof link.url === "string" ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.title}
                      </a>
                    ) : (
                      <a onClick={link.url}>{link.title}</a>
                    )}
                  </div>
                )}
                {(type === "persisting" ||
                  (type === "temporary" && hasCloseButton)) && (
                  <div className="close-icon-container">
                    <Close className="close-icon" onClick={this.close} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Transition>
    );
  }

  public componentDidMount(): void {
    if (this.props.type === "temporary" && this.props.duration) {
      this.setCloseTimeout(this.props.duration);
    } else if (this.props.type === "temporary") {
      this.setCloseTimeout();
    }
  }

  public componentWillUnmount(): void {
    this.clearCloseTimeout();
  }

  public componentDidUpdate(prevProps: IToastProps): void {
    if (prevProps.isVisible !== this.props.isVisible) {
      this.setState({
        isVisible: this.props.isVisible,
      });
    }
  }
  /**
   * Close the Toast Notification
   */
  private close = () => {
    this.clearCloseTimeout();
    this.setState({
      isVisible: false,
    });
  };

  /**
   * Category Management Function for proper Notification Icon
   * Return the Status Icon according to the category prop
   */
  private getCategoryIcon(): JSX.Element {
    if (this.props.category === "success") {
      return <SuccessHollow className="status-icon" />;
    } else if (this.props.category === "informational") {
      return <InfoHollow className="status-icon" />;
    } else {
      return <ErrorHollow className="status-icon" />;
    }
  }

  /**
   * Set the Timer to close the Toast Notification after 7 seconds
   */
  private setCloseTimeout(timeout = 7000) {
    this.closeTimeout = setTimeout(() => {
      this.close();
    }, timeout);
  }

  /**
   * Remove the Timer to close the Toast Notification (if its exists)
   */
  private clearCloseTimeout() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  private onRef(ref: HTMLDivElement) {
    if (ref) {
      const { height } = ref.getBoundingClientRect();
      this.setState({
        height,
      });
    }
  }
}

export default Toast;
