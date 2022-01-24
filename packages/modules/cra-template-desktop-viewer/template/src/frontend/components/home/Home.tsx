/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Home.scss";

import { InternetConnectivityStatus } from "@itwin/core-common";
import { useConnectivity } from "@itwin/desktop-viewer-react";
import { SvgFolderOpened, SvgImodel } from "@itwin/itwinui-icons-react";
import { Blockquote, Headline, Title } from "@itwin/itwinui-react";
import { Link, useNavigate } from "@reach/router";
import React, { useContext, useEffect, useState } from "react";

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
    <div>
      <Headline className="home-title">iTwin Viewer for Desktop</Headline>
      <div className="home">
        <div className="home-section start">
          <Title> {ITwinViewerApp.translate("home.start")}</Title>
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
          <Title> {ITwinViewerApp.translate("home.learn")}</Title>
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
          <Title>{ITwinViewerApp.translate("home.openRecent")}</Title>
          <Recents />
        </div>
      </div>
    </div>
  );
};

export default Home;
