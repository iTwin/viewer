/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Home.scss";

import { InternetConnectivityStatus } from "@itwin/core-common";
import { useConnectivity } from "@itwin/desktop-viewer-react";
import { SvgFolderOpened, SvgImodel } from "@itwin/itwinui-icons-react";
import { PageLayout } from "@itwin/itwinui-layouts-react";
import { Blockquote, Text } from "@itwin/itwinui-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";
import { SettingsContext } from "../../services/SettingsClient";
import { Recents } from "./Recents";

interface LearnLink {
  textKey: string;
  url: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [learnLinks, setLearnLinks] = useState<LearnLink[]>([]);
  const [linkClass, setLinkClass] = useState<string>();
  const userSettings = useContext(SettingsContext);
  const connectivityStatus = useConnectivity();

  useEffect(() => {
    void fetch("./links.json").then((response) => {
      if (response.status >= 200 && response.status < 300) {
        void response.json().then((links) => {
          setLearnLinks(links);
        });
      }
    });
  }, []);

  useEffect(() => {
    setLinkClass(
      connectivityStatus === InternetConnectivityStatus.Offline
        ? "disabled-link"
        : ""
    );
  }, [connectivityStatus]);

  const openFile = async () => {
    const filePath = await ITwinViewerApp.getFile();
    if (filePath) {
      void userSettings.addRecent(filePath);
      void navigate("/viewer", { state: { filePath } });
    }
  };

  return (
    <PageLayout.Content>
      <Text className="home-title" variant="headline">
        iTwin Viewer for Desktop
      </Text>
      <div className="home">
        <div className="home-section start">
          <Text variant="title"> {ITwinViewerApp.translate("home.start")}</Text>
          <nav>
            <div>
              <SvgFolderOpened />
              <span onClick={openFile}>{ITwinViewerApp.translate("open")}</span>
            </div>
            <div>
              <SvgImodel className={linkClass} />
              <Link to="itwins" className={linkClass}>
                {ITwinViewerApp.translate("download")}
              </Link>
            </div>
          </nav>
        </div>
        <div className="home-section learn">
          <Text variant="title"> {ITwinViewerApp.translate("home.learn")}</Text>
          {learnLinks.map((link) => {
            return (
              <Blockquote key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={linkClass}
                >
                  {ITwinViewerApp.translate(link.textKey)}
                </a>
              </Blockquote>
            );
          })}
        </div>
        <div className="home-section recent">
          <Text variant="title">
            {ITwinViewerApp.translate("home.openRecent")}
          </Text>
          <Recents />
        </div>
      </div>
    </PageLayout.Content>
  );
};

export default Home;
