/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import { AccessToken } from "@bentley/itwin-client";
import {
  ApiOverrides,
  ProjectFull,
  ProjectGrid,
  ProjectGridProps,
} from "@itwin/imodel-browser-react";
import {
  SvgCalendar,
  SvgList,
  SvgSearch,
  SvgStarHollow,
} from "@itwin/itwinui-icons-react";
import {
  ButtonGroup,
  HorizontalTab,
  HorizontalTabs,
  IconButton,
  LabeledInput,
} from "@itwin/itwinui-react";
import React, { useEffect, useState } from "react";
// import "./SelectProject.scss";

const PROJECT_TYPE_MAP = ["", "?recents", "?myprojects"];

const tabsWithIcons = [
  <HorizontalTab
    key="favorite"
    label="Favorite projects"
    startIcon={<SvgStarHollow />}
  />,
  <HorizontalTab
    key="recents"
    label="Recent projects"
    startIcon={<SvgCalendar />}
  />,
  <HorizontalTab key="all" label="My projects" startIcon={<SvgList />} />,
];

const SelectProject = ({ ...gridProps }) => {
  const [projectType, setProjectType] = useState(
    () =>
      // PROJECT_TYPE_MAP.includes(location.search)
      //   ? PROJECT_TYPE_MAP.indexOf(location.search)
      //   : 0
      0
  );

  const [searchValue, setSearchValue] = React.useState("");
  const [searchParam, setSearchParam] = React.useState("");
  const startSearch = React.useCallback(() => {
    setSearchParam(!searchValue ? "" : `?$search=${searchValue}`);
  }, [searchValue]);
  const [accessToken, setAccessToken] = useState<AccessToken | undefined>();

  useEffect(() => {
    const getAccessToken = async () => {
      const token = await IModelApp.authorizationClient?.getAccessToken();
      setAccessToken(token);
    };
    void getAccessToken();
  }, []);

  return accessToken ? (
    <>
      <div className="scrolling-tab-container select-project">
        <HorizontalTabs
          labels={tabsWithIcons}
          onTabSelected={setProjectType}
          activeIndex={projectType}
          type={"borderless"}
          contentClassName=" grid-holding-tab"
          tabsClassName="grid-holding-tabs"
        >
          <div className={"title-section"}>
            {projectType === 2 && (
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
            )}
          </div>
          <div className={"scrolling-tab-content"}>
            <ProjectGrid
              accessToken={accessToken.toTokenString()}
              requestType={
                projectType === 0
                  ? "favorites"
                  : projectType === 1
                  ? "recents"
                  : (searchParam as any) ?? ""
              }
              onThumbnailClick={(project) => {
                //     trackEvent("ProjectClicked", { project: project.id });
                //  navigate?.(`project/${project.id}`);
              }}
              //  projectActions={projectActions}
              //   apiOverrides={apiOverrides}
              //  key={refreshKey}
              stringsOverrides={{ noIModels: "No projects found" } as any}
              {...gridProps}
            />
          </div>
        </HorizontalTabs>
      </div>
    </>
  ) : null;
};

export default SelectProject;
