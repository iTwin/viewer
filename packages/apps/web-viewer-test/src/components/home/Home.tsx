/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import modelImg from "@bentley/icons-generic/icons/imodeljs.svg";
import { Button } from "@itwin/itwinui-react";
import React from "react";
import { RouteComponentProps } from "react-router";

import { ReactComponent as Itwin } from "../../images/itwin.svg";
import styles from "./Home.module.scss";

export const Home = ({ history }: RouteComponentProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>
          <p>
            <Itwin className={styles.logo} />
            {"iTwinViewer Sample App"}
          </p>
        </div>
        <img className={styles.img} src={modelImg} alt={"modelImage"} />
        <div className={styles.signIn}>
          <Button
            className={styles.homeButton}
            onClick={() => history.push("/authclient")}
            styleType={"high-visibility"}
            size={"large"}
          >
            {"Use Auth Client"}
          </Button>
          <Button
            className={styles.homeButton}
            onClick={() => history.push("/authconfig")}
            styleType={"cta"}
            size={"large"}
          >
            {"Use Auth Config"}
          </Button>
          <Button
            className={styles.homeButton}
            onClick={() => history.push("/blankconnection")}
            styleType={"default"}
            size={"large"}
          >
            {"Blank Connection"}
          </Button>
          <Button
            className={styles.homeButton}
            onClick={() => history.push("/imodelbank")}
            styleType={"default"}
            size={"large"}
          >
            {"iModel Bank"}
          </Button>
        </div>
      </div>
    </div>
  );
};
