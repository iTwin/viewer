/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { BackstageItem } from "@bentley/ui-abstract";
import {
  BackstageComposer,
  UserProfileBackstageItem,
} from "@bentley/ui-framework";
import * as React from "react";
import { useSelector } from "react-redux";

interface AppBackstageComposerProps {
  /** additional frontstages */
  items: BackstageItem[];
}

const AppBackstageComposer: React.FC<AppBackstageComposerProps> = ({
  items,
}: AppBackstageComposerProps) => {
  /** UserInfo from sign-in */
  const userInfo = useSelector((state: any) => {
    return state?.frameworkState?.sessionState?.userInfo;
  });

  return (
    <BackstageComposer
      header={userInfo && <UserProfileBackstageItem userInfo={userInfo} />}
      items={items}
    />
  );
};

export default AppBackstageComposer;
