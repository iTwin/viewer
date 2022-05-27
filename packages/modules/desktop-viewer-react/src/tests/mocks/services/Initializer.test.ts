/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
  IModelReadRpcInterface,
  IModelTileRpcInterface,
  SnapshotIModelRpcInterface,
} from "@itwin/core-common";
import type { IModelAppOptions } from "@itwin/core-frontend";
import { IModelApp } from "@itwin/core-frontend";
import { UiCore } from "@itwin/core-react";
import { PresentationRpcInterface } from "@itwin/presentation-common";
import type { ViewerInitializerParams } from "@itwin/viewer-react";

import { DesktopInitializer } from "../../services/Initializer";
import MockAuthorizationClient from "../mocks/MockAuthorizationClient";
