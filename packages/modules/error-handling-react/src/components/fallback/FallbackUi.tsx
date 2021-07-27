/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { Subheading2 } from "@bentley/ui-core";
import { Subheading } from "@itwin/itwinui-react";
import classNames from "classnames";
import React from "react";
import { Helmet } from "react-helmet-async";
import sanitizeHtml from "sanitize-html";

import styles from "./FallbackUi.module.scss";

interface Props {
  imageSource: string;
  imageAlt: string;
  title: string;
  text: string;
  className?: string; // optional css class to override container styles
  withHelmet?: boolean;
}

export const FallbackUi = ({
  imageSource,
  imageAlt,
  className,
  title,
  text,
  withHelmet,
}: Props): JSX.Element => {
  const innerText = sanitizeHtml(text);
  return (
    <div className={classNames(styles.container, className)}>
      {withHelmet && <Helmet title={title} />}
      <div className={styles.content}>
        <img src={imageSource} alt={imageAlt} data-testid="test-fallback-img" />
        <p className={styles.title} data-testid="test-fallback-title">
          <Subheading2>{title}</Subheading2>
        </p>
        <p className={styles.message} data-testid="test-fallback-text">
          <Subheading dangerouslySetInnerHTML={{ __html: innerText }} />
        </p>
      </div>
    </div>
  );
};
