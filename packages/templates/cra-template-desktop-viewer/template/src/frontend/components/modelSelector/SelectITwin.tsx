/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./SelectITwin.scss";

import { useAccessToken } from "@itwin/desktop-viewer-react";
import { ITwinGrid } from "@itwin/imodel-browser-react";
import {
  SvgCalendar,
  SvgList,
  SvgSearch,
  SvgStarHollow,
} from "@itwin/itwinui-icons-react";
import { IconButton, LabeledInput, Tab, Tabs } from "@itwin/itwinui-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { SignIn } from "../signin/SignIn";

const ITWIN_TYPE_MAP = ["", "?recents", "?myitwins"];

const tabsWithIcons = [
  <Tab key="favorite" label="Favorite iTwins" startIcon={<SvgStarHollow />} />,
  <Tab key="recents" label="Recent iTwins" startIcon={<SvgCalendar />} />,
  <Tab key="all" label="My iTwins" startIcon={<SvgList />} />,
];

export const SelectITwin = () => {
  const [iTwinType, setITwinType] = useState(() =>
    ITWIN_TYPE_MAP.includes(window.location.search)
      ? ITWIN_TYPE_MAP.indexOf(window.location.search)
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
      <div className="itv-scrolling-container select-itwin">
        <Tabs
          labels={tabsWithIcons}
          onTabSelected={setITwinType}
          activeIndex={iTwinType}
          type={"borderless"}
          contentClassName="grid-holding-tab"
          tabsClassName="grid-holding-tabs"
          orientation="horizontal"
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
            <ITwinGrid
              accessToken={accessToken}
              requestType={
                iTwinType === 0
                  ? "favorites"
                  : iTwinType === 1
                  ? "recents"
                  : (searchParam as any) ?? ""
              }
              onThumbnailClick={(itwin) => {
                void navigate(`/itwins/${itwin.id}`, {
                  state: { iTwinName: itwin.displayName },
                });
              }}
              stringsOverrides={{ noIModels: "No iTwins found" } as any}
              filterOptions={searchParam}
            />
          </div>
        </Tabs>
      </div>
    </>
  ) : (
    <SignIn />
  );
};
