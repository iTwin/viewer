/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./Home.scss";

import { Blockquote, Headline, Title } from "@itwin/itwinui-react";
import { Link, useNavigate } from "@reach/router";
import React, { useEffect, useState } from "react";

import { ITwinViewerApp } from "../../app/ITwinViewerApp";

interface LearnLink {
  textKey: string;
  url: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [learnLinks, setLearnLinks] = useState<LearnLink[]>([]);

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
            <span onClick={openSnapshot}>
              {ITwinViewerApp.translate("openSnapshot")}
            </span>
            <Link to="itwins">
              {ITwinViewerApp.translate("viewRemoteIModel")}
            </Link>
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
          <Title> {ITwinViewerApp.translate("home.openRecent")}</Title>
          <div>Coming Soon!</div>
        </div>
      </div>
    </div>
  );
};

export default Home;