/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Button, ButtonType } from "@bentley/ui-core";
import React from "react";

import styles from "./Header.module.scss";

interface HeaderProps {
  handleLogin: () => void;
  handleLogout: () => void;
  loggedIn: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  loggedIn,
  handleLogin,
  handleLogout,
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.button}
          onClick={handleLogin}
          buttonType={ButtonType.Primary}
          disabled={loggedIn}
        >
          {"Sign In"}
        </Button>
        <Button
          className={styles.button}
          onClick={handleLogout}
          buttonType={ButtonType.Primary}
          disabled={!loggedIn}
        >
          {"Sign Out"}
        </Button>
      </div>
    </header>
  );
};
