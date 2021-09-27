/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Home.scss";

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
  const userSettings = useContext(SettingsContext);

  useEffect(() => {
    void fetch("./links.json").then((response) => {
      if (response.status >= 200 && response.status < 300) {
        void response.json().then((links) => {
          setLearnLinks(links);
        });
      }
    });
  }, []);

  const openSnapshot = async () => {
    const snapshotPath = await ITwinViewerApp.getSnapshotFile();
    if (snapshotPath) {
      void userSettings.addRecentSnapshot(snapshotPath);
      void navigate("/snapshot", { state: { snapshotPath } });
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
              <span onClick={openSnapshot}>
                {ITwinViewerApp.translate("openSnapshot")}
              </span>
            </div>
            <div>
              <SvgImodel />
              <Link to="itwins">
                {ITwinViewerApp.translate("viewRemoteIModel")}
              </Link>
            </div>
          </nav>
        </div>
        <div className="home-section learn">
          <Title> {ITwinViewerApp.translate("home.learn")}</Title>
          {learnLinks.map((link) => {
            return (
              <Blockquote key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
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
