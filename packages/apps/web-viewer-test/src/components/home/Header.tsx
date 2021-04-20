/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ReactComponent as Home } from "@bentley/icons-generic/icons/home.svg";
import { Button, ButtonType } from "@bentley/ui-core";
import React from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.scss";

interface HeaderProps {
  handleLoginToggle: () => void;
  loggedIn: boolean;
}

export const Header = ({ handleLoginToggle, loggedIn }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <Link className={styles.homeLink} to={"/"}>
        <Home className={styles.logo} />
      </Link>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          onClick={handleLoginToggle}
          buttonType={ButtonType.Primary}
        >
          {loggedIn ? "Sign Out" : "Sign In"}
        </Button>
      </div>
    </header>
  );
};
