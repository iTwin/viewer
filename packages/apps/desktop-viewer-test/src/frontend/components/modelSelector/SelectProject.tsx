/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectProject.scss";

import { useAccessToken } from "@itwin/desktop-viewer-react";
import { ProjectGrid } from "@itwin/imodel-browser-react";
import {
  SvgCalendar,
  SvgList,
  SvgSearch,
  SvgStarHollow,
} from "@itwin/itwinui-icons-react";
import {
  HorizontalTabs,
  IconButton,
  LabeledInput,
  Tab,
} from "@itwin/itwinui-react";
import { useNavigate } from "@reach/router";
import React, { useState } from "react";

import { SignIn } from "../signin/SignIn";

const PROJECT_TYPE_MAP = ["", "?recents", "?myprojects"];

const tabsWithIcons = [
  <Tab
    key="favorite"
    label="Favorite projects"
    startIcon={<SvgStarHollow />}
  />,
  <Tab key="recents" label="Recent projects" startIcon={<SvgCalendar />} />,
  <Tab key="all" label="My projects" startIcon={<SvgList />} />,
];

export const SelectProject = () => {
  const [projectType, setProjectType] = useState(() =>
    PROJECT_TYPE_MAP.includes(window.location.search)
      ? PROJECT_TYPE_MAP.indexOf(window.location.search)
      : 0
  );

  const [searchValue, setSearchValue] = React.useState("");
  const [searchParam, setSearchParam] = React.useState("");
  const startSearch = React.useCallback(() => {
    setSearchParam(searchValue);
  }, [searchValue]);
  const accessToken = useAccessToken();
  const navigate = useNavigate();

  return accessToken ? (
    <>
      <div className="itv-scrolling-container select-project">
        <HorizontalTabs
          labels={tabsWithIcons}
          onTabSelected={setProjectType}
          activeIndex={projectType}
          type={"borderless"}
          contentClassName="grid-holding-tab"
          tabsClassName="grid-holding-tabs"
        >
          <div className={"title-section"}>
            <div className={"inline-input-with-button"}>
              <LabeledInput
                label={"Search"}
                placeholder={"Will search in name or number"}
                displayStyle={"inline"}
                value={searchValue}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setSearchValue(value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    startSearch();
                  }
                  if (event.key === "Escape") {
                    setSearchValue("");
                    setSearchParam("");
                  }
                }}
              />
              <IconButton onClick={startSearch}>
                <SvgSearch />
              </IconButton>
            </div>
          </div>
          <div className="itv-scrolling-content">
            <ProjectGrid
              accessToken={accessToken}
              requestType={
                projectType === 0
                  ? "favorites"
                  : projectType === 1
                  ? "recents"
                  : (searchParam as any) ?? ""
              }
              onThumbnailClick={(project) => {
                void navigate(`itwins/${project.id}`, {
                  state: { projectName: project.displayName },
                });
              }}
              stringsOverrides={{ noIModels: "No projects found" } as any}
              filterOptions={searchParam}
            />
          </div>
        </HorizontalTabs>
      </div>
    </>
  ) : (
    <SignIn />
  );
};
